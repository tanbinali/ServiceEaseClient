import { useContext } from "react";
import CartContext from "../contexts/CartContext";

const useCartContext = () => {
  return useContext(CartContext);
};

export default useCartContext;
