import { useCallback, useState } from "react";
import authApiClient from "../services/auth-api-client";

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create or get cart
  const createOrGetCart = useCallback(async () => {
    try {
      const response = await authApiClient.post("/api/carts/");
      setCart(response.data);
      return response.data;
    } catch (err) {
      console.error("Error creating cart:", err);
    }
  }, []);

  // Add item
  const addItemToCart = useCallback(
    async (serviceId, quantity) => {
      const currentCart = cart || (await createOrGetCart());
      try {
        const response = await authApiClient.post(
          `/api/carts/${currentCart.id}/items/`,
          { service: serviceId, quantity }
        );

        const addedItem = response.data;

        setCart((prev) => {
          const existingItemIndex = prev?.items?.findIndex(
            (i) => i.id === addedItem.id
          );
          if (existingItemIndex !== -1) {
            // Replace the updated item
            const updatedItems = [...prev.items];
            updatedItems[existingItemIndex] = addedItem;
            return { ...prev, items: updatedItems };
          } else {
            return { ...prev, items: [...(prev?.items || []), addedItem] };
          }
        });

        return addedItem;
      } catch (err) {
        console.error("Error adding item:", err.response?.data || err);
        throw err;
      }
    },
    [cart, createOrGetCart]
  );

  // Update Item Quantity
  const updateCartItemQuantity = useCallback(
    async (cartId, itemId, newQuantity) => {
      try {
        const response = await authApiClient.patch(
          `/api/carts/${cartId}/items/${itemId}/`,
          { quantity: newQuantity }
        );

        setCart((prev) => ({
          ...prev,
          items: prev.items.map((i) =>
            i.id === itemId ? { ...i, quantity: newQuantity } : i
          ),
        }));

        return response.data;
      } catch (error) {
        console.error("Error updating item:", error);
        throw error;
      }
    },
    []
  );

  // Remove item
  const removeCartItem = useCallback(async (cartId, itemId) => {
    try {
      await authApiClient.delete(`/api/carts/${cartId}/items/${itemId}/`);

      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
      }));
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  }, []);

  return {
    cart,
    loading,
    createOrGetCart,
    addItemToCart,
    updateCartItemQuantity,
    removeCartItem,
    setCart,
  };
};

export default useCart;
