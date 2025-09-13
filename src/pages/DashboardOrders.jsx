import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaCreditCard,
  FaCalendarAlt,
  FaSyncAlt,
  FaClock,
  FaBoxOpen,
  FaInfoCircle,
  FaClipboardList,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import authApiClient from "../services/auth-api-client";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", color: "badge-warning" },
  { value: "ACCEPTED", label: "Accepted", color: "badge-info" },
  { value: "IN_PROGRESS", label: "In Progress", color: "badge-primary" },
  { value: "COMPLETED", label: "Completed", color: "badge-success" },
  { value: "CANCELLED", label: "Cancelled", color: "badge-error" },
];

const getStatusColor = (status) => {
  const option = STATUS_OPTIONS.find((opt) => opt.value === status);
  return option ? option.color : "badge-neutral";
};

const DashboardOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filter states
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Determine user role
  const isAdmin = user?.groups?.includes("Admin");

  // Titles and texts based on role
  const pageTitle = isAdmin ? "Orders" : "My Orders";
  const loadingMessage = isAdmin
    ? "Loading all orders..."
    : "Loading your orders...";

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await authApiClient.get("api/orders/");
      setOrders(data.results || []);
      setFilteredOrders(data.results || []);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading]);

  // Filter orders based on status and search query
  useEffect(() => {
    let result = orders;

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toString().includes(query) ||
          order.order_items.some((item) =>
            item.service_name.toLowerCase().includes(query)
          )
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await authApiClient.patch(`api/orders/${orderId}/`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
      setError("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const parseDurationToHours = (durationStr) => {
    const [hours, minutes, seconds] = durationStr.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
  };

  const handlePayNow = async (order) => {
    await toast.promise(
      authApiClient.post(`api/payment/initiate/`, {
        amount: order.total_price,
        orderId: order.id,
        numItems: order.order_items?.length,
      }),
      {
        loading: "Redirecting to payment...",
        success: (response) => {
          if (response.data.payment_url) {
            setTimeout(() => {
              window.location.href = response.data.payment_url;
            }, 1000);
          }
          return "Redirecting to payment gateway...";
        },
        error: (err) => {
          // get backend error message if available
          const detail =
            err.response?.data?.error ||
            err.response?.data?.detail ||
            "Payment initiation failed.";
          return detail;
        },
      }
    );
  };

  if (loading || authLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-col items-center justify-center min-h-screen gap-4"
      >
        <FaSpinner className="animate-spin text-6xl" />
        <p className="text-lg text-base-content/70">{loadingMessage}</p>
      </motion.div>
    );
  }

  if (error)
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-md mx-auto mt-16 p-8 rounded-box bg-error/10 text-error-content text-center shadow-lg"
      >
        <FaExclamationTriangle className="mx-auto mb-4 text-4xl" />
        <p className="mb-4 font-semibold">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchOrders();
          }}
          className="btn btn-primary gap-2"
        >
          <FaSyncAlt /> Try Again
        </button>
      </motion.div>
    );

  if (!orders.length)
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-center mt-24 p-6"
      >
        <div className="max-w-md mx-auto">
          <FaBoxOpen className="mx-auto text-6xl text-base-content/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
          <p className="text-base-content/70 mb-6">
            You haven't placed any orders yet. Browse our services to get
            started.
          </p>
          <Link to="/services" className="btn btn-primary gap-2">
            Browse Services
          </Link>
        </div>
      </motion.div>
    );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="max-w-6xl mx-auto p-4 md:p-6 space-y-8"
    >
      <header className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 flex items-center justify-center gap-3">
          <FaClipboardList aria-hidden="true" />
          <span>{pageTitle}</span>
        </h1>
        <p className="text-base-content/70">
          {isAdmin ? "Manage all user orders." : "Manage your orders here."}
        </p>
      </header>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-base-200 p-4 rounded-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-sm btn-outline gap-2"
            >
              <FaFilter /> Filters
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm input-bordered pl-9"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            </div>
          </div>

          <div className="text-sm text-base-content/70">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-base-300"
            >
              <div className="flex flex-wrap gap-4 items-center">
                <label className="font-medium">Status:</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`btn btn-sm ${
                      statusFilter === "ALL" ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    All Orders
                  </button>
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setStatusFilter(status.value)}
                      className={`btn btn-sm ${
                        statusFilter === status.value
                          ? status.color.replace("badge", "btn")
                          : "btn-outline"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Orders List */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-base-100 rounded-box border border-base-300 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 pb-4 border-b border-base-300">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    Order #{order.id}
                    <span
                      className={`badge badge-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </h2>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-base-content/70">
                      <FaCalendarAlt className="text-base-content/50" />
                      <span>
                        Created:{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-base-content/70">
                      <FaSyncAlt className="text-base-content/50" />
                      <span>
                        Updated:{" "}
                        {new Date(order.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-base-content/70">
                      <FaClock className="text-base-content/50" />
                      <span>
                        Duration:{" "}
                        {order.order_items
                          ?.reduce(
                            (sum, item) =>
                              sum +
                              parseDurationToHours(item.duration) *
                                item.quantity,
                            0
                          )
                          .toFixed(2)}{" "}
                        hrs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-base-content/70">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ${Number(order.total_price).toFixed(2)}
                    </p>
                  </div>

                  <OrderActions
                    order={order}
                    user={user}
                    updatingOrderId={updatingOrderId}
                    onChange={updateOrderStatus}
                    onPay={handlePayNow}
                  />
                </div>
              </div>

              {/* Order items list */}
              <div className="space-y-4">
                <h3 className="font-semibold text-base-content/80 flex items-center gap-2">
                  <FaInfoCircle className="text-base-content/60" />
                  Order Items
                </h3>
                {order.order_items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center py-3 bg-base-200 rounded-box px-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base-content">
                        {item.service_name}
                      </p>
                      <p className="text-sm text-base-content/70">
                        Quantity: {item.quantity} × $
                        {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="font-semibold text-base-content">
                      ${(item.quantity * Number(item.price)).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <FaBoxOpen className="mx-auto text-4xl text-base-content/30 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              No orders match your filters
            </h3>
            <p className="text-base-content/70 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setSearchQuery("");
              }}
              className="btn btn-outline btn-sm"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const OrderActions = ({ order, user, updatingOrderId, onChange, onPay }) => {
  const isAdmin = user?.groups?.includes("Admin");
  const isUpdating = updatingOrderId === order.id;

  if (isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-2 min-w-[200px]"
      >
        <label className="text-sm text-base-content/70">Update Status</label>
        <select
          className={`select select-bordered select-sm ${
            isUpdating ? "animate-pulse" : ""
          }`}
          value={order.status}
          onChange={(e) => onChange(order.id, e.target.value)}
          disabled={isUpdating}
          aria-label="Change order status"
        >
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {isUpdating && (
          <span className="text-xs text-base-content/50 flex items-center gap-1">
            <FaSpinner className="animate-spin" /> Updating...
          </span>
        )}
      </motion.div>
    );
  }

  const isProfileComplete = (user) => {
    if (!user || !user.profile) return false;
    const { full_name, phone_number, address } = user.profile;
    return Boolean(full_name && phone_number && address);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
    >
      {order.status === "PENDING" && (
        <div className="flex gap-2">
          {isProfileComplete(user) ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPay(order)}
              className="btn btn-success btn-sm gap-2"
              aria-label={`Pay now for order ${order.id}`}
            >
              <FaCreditCard /> Pay Now
            </motion.button>
          ) : (
            <Link
              to="/dashboard"
              className="btn btn-warning btn-sm gap-2"
              aria-label="Setup profile before paying"
            >
              <FaInfoCircle /> Setup Profile to Pay
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardOrders;
