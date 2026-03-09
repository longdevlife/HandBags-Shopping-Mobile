import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
} from "../utils/cartStorage";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const addItem = useCallback(async (product, qty = 1) => {
    const updated = await addToCart(product, qty);
    setCart(updated);
  }, []);

  const updateQty = useCallback(async (handbagName, qty) => {
    const updated = await updateCartQty(handbagName, qty);
    setCart(updated);
  }, []);

  const removeItem = useCallback(async (handbagName) => {
    const updated = await removeFromCart(handbagName);
    setCart(updated);
  }, []);

  const clearAll = useCallback(async () => {
    await clearCart();
    setCart([]);
  }, []);

  const reloadCart = useCallback(async () => {
    const data = await getCart();
    setCart(data);
  }, []);

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.cost * c.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        updateQty,
        removeItem,
        clearAll,
        reloadCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart() phải được dùng bên trong <CartProvider>");
  }
  return context;
}
