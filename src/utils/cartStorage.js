import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "@shopping_cart";

export const getCart = async () => {
  try {
    const json = await AsyncStorage.getItem(CART_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Error reading cart", e);
    return [];
  }
};

/**
 * Add item to cart or increase quantity if already exists.
 * Returns updated cart array.
 */
export const addToCart = async (product, qty = 1) => {
  try {
    const cart = await getCart();
    const idx = cart.findIndex((c) => c.handbagName === product.handbagName);

    if (idx >= 0) {
      cart[idx].quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  } catch (e) {
    console.error("Error adding to cart", e);
    return [];
  }
};

/**
 * Update quantity for a specific item. If qty <= 0, remove it.
 */
export const updateCartQty = async (handbagName, qty) => {
  try {
    let cart = await getCart();
    if (qty <= 0) {
      cart = cart.filter((c) => c.handbagName !== handbagName);
    } else {
      const idx = cart.findIndex((c) => c.handbagName === handbagName);
      if (idx >= 0) cart[idx].quantity = qty;
    }
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  } catch (e) {
    console.error("Error updating cart qty", e);
    return [];
  }
};

/**
 * Remove one item from cart by name.
 */
export const removeFromCart = async (handbagName) => {
  try {
    const cart = await getCart();
    const updated = cart.filter((c) => c.handbagName !== handbagName);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Error removing from cart", e);
    return [];
  }
};

/**
 * Clear entire cart.
 */
export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
    return [];
  } catch (e) {
    console.error("Error clearing cart", e);
    return [];
  }
};
