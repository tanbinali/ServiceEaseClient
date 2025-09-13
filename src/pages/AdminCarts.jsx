import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useCart from "../hooks/useCart";
import authApiClient from "../services/auth-api-client";
import {
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaSpinner,
  FaUserCircle,
  FaClock,
  FaDollarSign,
  FaBoxOpen,
  FaCheckCircle,
  FaUsers,
  FaShoppingCart,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";
import defaultImage from "../assets/default-image.jpg";

const AdminCarts = () => {
  const { updateCartItemQuantity, removeCartItem } = useCart();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };
  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

  // Helpers for durations
  const formatDuration = (duration) => {
    if (!duration) return "0h 0m";
    const parts = duration.split(":").map(Number);
    if (parts.length < 2) return duration;
    const [hours, minutes] = parts;
    return `${hours}h ${minutes}m`;
  };
  const renderTotalDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const fetchCarts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authApiClient.get("/api/carts/");
      const cartsData = res.data.results || [];

      const cartsWithDetails = await Promise.all(
        cartsData.map(async (cart) => {
          if (!cart.items || cart.items.length === 0) {
            return { ...cart, items: [], totalPrice: 0, totalDuration: 0 };
          }
          const itemsWithDetails = await Promise.all(
            cart.items.map(async (item) => {
              try {
                const sRes = await authApiClient.get(
                  `/api/services/${item.service}/`
                );
                const service = sRes.data;
                const [h = 0, m = 0] = (service.duration || "0:00")
                  .split(":")
                  .map(Number);
                const durationSeconds = h * 3600 + m * 60;

                return {
                  ...item,
                  service_name: service.name,
                  price: service.price,
                  duration: service.duration,
                  durationSeconds,
                  image: service.image || defaultImage,
                  service_available: service.active !== false,
                };
              } catch {
                return {
                  ...item,
                  service_name: "Unknown Service",
                  price: 0,
                  duration: "0:00",
                  durationSeconds: 0,
                  image: defaultImage,
                  service_available: false,
                };
              }
            })
          );

          const totalPrice = itemsWithDetails.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const totalDuration = itemsWithDetails.reduce(
            (sum, item) => sum + item.durationSeconds * item.quantity,
            0
          );

          return {
            ...cart,
            items: itemsWithDetails,
            totalPrice,
            totalDuration,
            itemCount: itemsWithDetails.length,
            createdAt: new Date(cart.created_at || cart.date_created),
          };
        })
      );

      setCarts(cartsWithDetails);
    } catch (err) {
      console.error("Fetch carts error:", err);
      setError("Failed to fetch carts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleUpdateQuantity = async (cartId, item, newQty) => {
    if (newQty < 1) return;
    setUpdatingItem(item.id);
    try {
      await updateCartItemQuantity(item.service, newQty, item.id);
      setCarts((prev) =>
        prev.map((cart) =>
          cart.id === cartId
            ? {
                ...cart,
                items: cart.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: newQty } : i
                ),
                totalPrice: cart.items.reduce(
                  (sum, i) =>
                    sum + i.price * (i.id === item.id ? newQty : i.quantity),
                  0
                ),
                totalDuration: cart.items.reduce(
                  (sum, i) =>
                    sum +
                    i.durationSeconds *
                      (i.id === item.id ? newQty : i.quantity),
                  0
                ),
              }
            : cart
        )
      );
    } catch {
      setError("Failed to update quantity.");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (cartId, itemId) => {
    setUpdatingItem(itemId);
    try {
      await removeCartItem(itemId);
      setCarts((prev) =>
        prev.map((cart) =>
          cart.id === cartId
            ? {
                ...cart,
                items: cart.items.filter((i) => i.id !== itemId),
                totalPrice: cart.items
                  .filter((i) => i.id !== itemId)
                  .reduce((sum, i) => sum + i.price * i.quantity, 0),
                totalDuration: cart.items
                  .filter((i) => i.id !== itemId)
                  .reduce((sum, i) => sum + i.durationSeconds * i.quantity, 0),
                itemCount: cart.items.filter((i) => i.id !== itemId).length,
              }
            : cart
        )
      );
    } catch {
      setError("Failed to remove item.");
    } finally {
      setUpdatingItem(null);
    }
  };

  const filteredCarts = carts
    .filter((cart) => {
      const matchesSearch =
        cart.id.toString().includes(searchTerm) ||
        cart.user.toString().includes(searchTerm) ||
        cart.items.some((item) =>
          item.service_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "empty" && cart.items.length === 0) ||
        (filterBy === "hasItems" && cart.items.length > 0);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "priceHigh":
          return b.totalPrice - a.totalPrice;
        case "priceLow":
          return a.totalPrice - b.totalPrice;
        case "itemsHigh":
          return b.itemCount - a.itemCount;
        case "itemsLow":
          return a.itemCount - b.itemCount;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen flex items-center justify-center bg-base-100 p-4"
      >
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-base-content/60">Loading carts...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen flex items-center justify-center bg-base-100 p-4"
      >
        <div className="text-center p-6 sm:p-8 bg-base-200 rounded-2xl max-w-md">
          <div className="bg-error/10 rounded-full p-4 inline-block mb-4">
            <FaExclamationTriangle className="text-3xl text-error" />
          </div>
          <h2 className="text-xl font-bold text-base-content mb-2">Error</h2>
          <p className="text-base-content/70 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCarts}
            className="btn btn-primary"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-base-100 py-8 px-2 sm:px-4 md:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={slideUp} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary/10 p-4 rounded-2xl"
            >
              <FaShoppingCart className="text-4xl text-primary" />
            </motion.div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
            Admin Cart Management
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base">
            Manage and monitor all user shopping carts
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
        >
          {[
            {
              icon: FaUsers,
              label: "Total Carts",
              value: carts.length,
              color: "primary",
              delay: 0,
            },
            {
              icon: FaCheckCircle,
              label: "Active Items",
              value: carts.reduce((sum, cart) => sum + cart.items.length, 0),
              color: "secondary",
              delay: 0.1,
            },
            {
              icon: FaDollarSign,
              label: "Total Value",
              value: `$${carts
                .reduce((sum, cart) => sum + cart.totalPrice, 0)
                .toFixed(2)}`,
              color: "accent",
              delay: 0.2,
            },
            {
              icon: FaBoxOpen,
              label: "Empty Carts",
              value: carts.filter((cart) => cart.items.length === 0).length,
              color: "info",
              delay: 0.3,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={slideUp}
              transition={{ delay: stat.delay }}
              whileHover={{ y: -2 }}
              className="bg-base-200 p-4 sm:p-6 rounded-2xl shadow-sm border border-base-300 flex items-center gap-3"
            >
              <div className={`rounded-2xl bg-${stat.color}/10 p-3`}>
                <stat.icon className={`text-2xl text-${stat.color}`} />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-base-content/60">
                  {stat.label}
                </p>
                <h3 className="text-lg sm:text-2xl font-bold text-base-content">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-base-200 rounded-2xl shadow-sm border border-base-300 p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-base-content/40" />
              </div>
              <input
                type="text"
                placeholder="Search carts by ID, user, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10 text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="select select-bordered text-sm"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All Carts</option>
                <option value="hasItems">With Items</option>
                <option value="empty">Empty Carts</option>
              </motion.select>
              <motion.select
                whileHover={{ scale: 1.02 }}
                className="select select-bordered text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="itemsHigh">Most Items</option>
                <option value="itemsLow">Fewest Items</option>
              </motion.select>
            </div>
          </div>
        </motion.div>

        {/* Carts List */}
        <AnimatePresence mode="popLayout">
          {filteredCarts.length === 0 ? (
            <motion.div
              key="no-carts"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8 sm:py-16 bg-base-200 rounded-2xl border border-base-300"
            >
              <div className="bg-base-100 rounded-full p-3 inline-block mb-3 sm:mb-4">
                <FaBoxOpen className="text-3xl sm:text-4xl text-base-content/60" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-base-content mb-2">
                No carts found
              </h3>
              <p className="text-base-content/70 mb-4 sm:mb-6">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No carts match the current filters"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setFilterBy("all");
                  setSortBy("newest");
                }}
                className="btn btn-primary btn-sm sm:btn-md"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-4 sm:space-y-6"
            >
              {filteredCarts.map((cart) => (
                <motion.div
                  key={cart.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-4 sm:p-6"
                >
                  {/* Cart Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        className="bg-primary/10 p-2 sm:p-3 rounded-2xl"
                      >
                        <FaUserCircle className="text-xl sm:text-2xl text-primary" />
                      </motion.div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-base-content">
                          Cart #{cart.id}
                        </h3>
                        <p className="text-xs sm:text-sm text-base-content/60">
                          User ID: {cart.user}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="badge badge-primary badge-sm sm:badge-lg gap-1 sm:gap-2"
                      >
                        <FaDollarSign />${cart.totalPrice.toFixed(2)}
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="badge badge-secondary badge-sm sm:badge-lg gap-1 sm:gap-2"
                      >
                        <FaClock />
                        {renderTotalDuration(cart.totalDuration)}
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="badge badge-accent badge-sm sm:badge-lg gap-1 sm:gap-2"
                      >
                        <FaCheckCircle />
                        {cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""}
                      </motion.div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  {cart.items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-4 sm:py-6 bg-base-200 rounded-xl"
                    >
                      <FaBoxOpen className="text-2xl sm:text-3xl text-base-content/60 mx-auto mb-1 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-base-content/60">
                        This cart is empty
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2 sm:space-y-4">
                      <AnimatePresence>
                        {cart.items.map((item) => {
                          const isUnavailable = !item.service_available;
                          return (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-4 rounded-xl border ${
                                isUnavailable
                                  ? "border-error/30 bg-error/10"
                                  : "border-base-300 bg-base-200"
                              }`}
                            >
                              {/* Item Info */}
                              <div className="flex items-center gap-3 flex-1 min-w-0 mb-2 sm:mb-0">
                                <motion.img
                                  whileHover={{ scale: 1.05 }}
                                  src={item.image}
                                  alt={item.service_name}
                                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-base-300"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className={`font-semibold truncate text-sm sm:text-base ${
                                      isUnavailable
                                        ? "text-error"
                                        : "text-base-content"
                                    }`}
                                  >
                                    {item.service_name}
                                    {isUnavailable && (
                                      <span className="badge badge-error ml-1 sm:ml-2 text-[8px] sm:text-xs">
                                        Unavailable
                                      </span>
                                    )}
                                  </h4>
                                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-base-content/60 mt-1">
                                    <span>${item.price} each</span>
                                    <span>•</span>
                                    <span>{formatDuration(item.duration)}</span>
                                    <span>•</span>
                                    <span className="font-semibold">
                                      Total: $
                                      {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  className="flex items-center gap-1 bg-base-100 rounded-lg p-1"
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        cart.id,
                                        item,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={
                                      updatingItem === item.id ||
                                      item.quantity <= 1
                                    }
                                    className="btn btn-ghost btn-xs"
                                  >
                                    <FaMinus className="w-3 h-3" />
                                  </motion.button>
                                  <span className="font-bold text-base-content w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        cart.id,
                                        item,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={
                                      updatingItem === item.id ||
                                      !item.service_available
                                    }
                                    className="btn btn-ghost btn-xs"
                                  >
                                    <FaPlus className="w-3 h-3" />
                                  </motion.button>
                                </motion.div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    handleRemoveItem(cart.id, item.id)
                                  }
                                  disabled={updatingItem === item.id}
                                  className="btn btn-error btn-xs ml-1 sm:ml-2"
                                  aria-label="Remove"
                                >
                                  {updatingItem === item.id ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <FaTrashAlt />
                                  )}
                                </motion.button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminCarts;
