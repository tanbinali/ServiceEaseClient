import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useCartContext from "../hooks/useCartContext";
import authApiClient from "../services/auth-api-client";
import defaultImage from "../assets/default-image.jpg";

import { CartItem } from "../components/Cart/CartItem";
import { OrderSummary } from "../components/Cart/OrderSummary";
import { EmptyCart } from "../components/Cart/EmptyCart";
import { LoadingCart } from "../components/Cart/LoadingCart";
import { ErrorCart } from "../components/Cart/ErrorCart";

import { motion, AnimatePresence } from "framer-motion";

// Convert "HH:MM" string to minutes
function durationStrToMinutes(str) {
  if (!str) return 0;
  const parts = str.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3)
    return parts[0] * 60 + parts[1] + Math.floor(parts[2] / 60);
  return Number(str);
}

// Convert minutes to "H:MM"
function minutesToHHMM(mins) {
  if (!mins || Number.isNaN(mins)) return "0:00";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}:${m.toString().padStart(2, "0")}`;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const alertVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const Cart = () => {
  const { cart, createOrGetCart, updateCartItemQuantity, removeCartItem } =
    useCartContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await createOrGetCart();

      if (!cartData?.items?.length) {
        setItems([]);
        return;
      }

      const services = await Promise.all(
        cartData.items.map((item) =>
          authApiClient
            .get(`api/services/${item.service}/`)
            .then((res) => res.data)
        )
      );

      const detailedItems = cartData.items.map((item) => {
        const service = services.find((s) => s.id === item.service);
        return {
          ...item,
          cartItemId: item.id,
          service_name: service?.name || "Unknown Service",
          price: service?.price || 0,
          duration: service?.duration || "0:00",
          image: service?.image || defaultImage,
          service_available: service?.active !== false,
        };
      });

      setItems(detailedItems);
    } catch {
      setError("Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (item, newQuantity) => {
    setUpdatingItem(item.id);
    try {
      if (newQuantity <= 0) {
        await removeCartItem(item.cart, item.id);
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        await updateCartItemQuantity(item.cart, item.id, newQuantity);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          )
        );
      }
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.error("Failed to update cart. Please try again.");
    } finally {
      setUpdatingItem(null);
    }
  };

  const increaseQty = (item) => handleQuantityChange(item, item.quantity + 1);
  const decreaseQty = (item) => handleQuantityChange(item, item.quantity - 1);
  const removeItem = (item) => handleQuantityChange(item, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalMinutes = items.reduce(
    (sum, item) => sum + durationStrToMinutes(item.duration) * item.quantity,
    0
  );
  const totalDuration = minutesToHHMM(totalMinutes);

  const unavailableItems = items.filter((item) => !item.service_available);

  const handlePlaceOrder = async () => {
    if (totalItems === 0 || unavailableItems.length) return;
    setPlacingOrder(true);
    try {
      await authApiClient.post("/api/orders/", {});
      toast.success("Order placed successfully!");
      setItems([]);
      navigate("/dashboard/orders");
    } catch {
      toast.error("Failed to place order!");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <LoadingCart />;
  if (error)
    return (
      <ErrorCart
        error={error}
        retry={() => {
          setError(null);
          fetchCart();
        }}
      />
    );
  if (items.length === 0) return <EmptyCart />;

  return (
    <motion.div
      className="min-h-screen bg-base-100 py-8"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-8" variants={containerVariants}>
          <motion.h1
            className="text-4xl font-black text-base-content mb-2 flex items-center justify-center gap-3"
            variants={itemVariants}
          >
            Shopping Cart
          </motion.h1>
          <motion.p
            className="text-base-content/70"
            variants={itemVariants}
            transition={{ delay: 0.2 }}
          >
            Review and manage your selected services
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {unavailableItems.length > 0 && (
            <motion.div
              className="alert bg-warning/10 border-warning text-warning rounded-2xl mb-6 flex items-center gap-3"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={alertVariants}
            >
              <span>
                {unavailableItems.length} item
                {unavailableItems.length !== 1 ? "s" : ""} unavailable. Please
                remove them to checkout.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="grid lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <motion.div
            className="lg:col-span-2 flex flex-col gap-6"
            variants={containerVariants}
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  variants={itemVariants}
                  layout
                >
                  <CartItem
                    item={item}
                    updatingItem={updatingItem}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    removeItem={removeItem}
                    formatDuration={minutesToHHMM}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants}>
            <OrderSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              totalDuration={totalDuration}
              unavailableItems={unavailableItems}
              placingOrder={placingOrder}
              handlePlaceOrder={handlePlaceOrder}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
