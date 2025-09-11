import { useEffect, useState } from "react";
import useCart from "../hooks/useCart";
import authApiClient from "../services/auth-api-client";

import { LoadingOrError } from "../components/AdminCarts/LoadingOrError";
import { CartStats } from "../components/AdminCarts/CartStats";
import { CartFilters } from "../components/AdminCarts/CartFilters";
import { CartList } from "../components/AdminCarts/CartList";

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
      console.error("Update quantity failed");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (cartId, itemId) => {
    setUpdatingItem(itemId);
    try {
      await removeCartItem(itemId);
      setCarts((prev) =>
        prev.map((cart) => {
          if (cart.id !== cartId) return cart;
          const newItems = cart.items.filter((i) => i.id !== itemId);
          return {
            ...cart,
            items: newItems,
            totalPrice: newItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            ),
            totalDuration: newItems.reduce(
              (sum, i) => sum + i.durationSeconds * i.quantity,
              0
            ),
            itemCount: newItems.length,
          };
        })
      );
    } catch {
      console.error("Remove item failed");
    } finally {
      setUpdatingItem(null);
    }
  };

  const filteredCarts = carts
    .filter((cart) => {
      if (filterBy === "hasItems") return cart.items.length > 0;
      if (filterBy === "empty") return cart.items.length === 0;
      return true;
    })
    .filter((cart) => {
      const term = searchTerm.toLowerCase();
      return (
        cart.id.toString().includes(term) ||
        cart.user?.toString().includes(term) ||
        cart.items.some((item) =>
          item.service_name.toLowerCase().includes(term)
        )
      );
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

  return (
    <div className="container mx-auto py-8">
      <LoadingOrError loading={loading} error={error} retry={fetchCarts} />
      {!loading && !error && (
        <>
          <CartStats carts={carts} />
          <CartFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <CartList
            filteredCarts={filteredCarts}
            updatingItem={updatingItem}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveItem={handleRemoveItem}
            renderTotalDuration={renderTotalDuration}
            setSearchTerm={setSearchTerm}
            setFilterBy={setFilterBy}
            setSortBy={setSortBy}
            searchTerm={searchTerm}
          />
        </>
      )}
    </div>
  );
};

export default AdminCarts;
