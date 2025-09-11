import { FaShoppingCart } from "react-icons/fa";

export const LoadingCart = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-100">
    <div className="text-center">
      <FaShoppingCart className="animate-bounce text-5xl text-primary mx-auto mb-6" />
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-base-content/60">Loading your cart...</p>
    </div>
  </div>
);
