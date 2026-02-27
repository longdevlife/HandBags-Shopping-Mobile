import AsyncStorage from "@react-native-async-storage/async-storage";

const ORDER_KEY = "@handbag_orders";

/**
 * Get all orders.
 */
export const getOrders = async () => {
  try {
    const json = await AsyncStorage.getItem(ORDER_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Error reading orders:", e);
    return [];
  }
};

/**
 * Place a new order.
 */
export const placeOrder = async (item, quantity, deliveryMethod) => {
  try {
    const orders = await getOrders();

    const deliveryFee = deliveryMethod === "deliver" ? 2.0 : 0;
    const discount = deliveryMethod === "deliver" ? 1.0 : 0;
    const subtotal = item.cost * quantity;

    const order = {
      id: `order-${Date.now()}`,
      item: {
        handbagName: item.handbagName,
        brand: item.brand,
        category: item.category,
        cost: item.cost,
        uri: item.uri,
        percentOff: item.percentOff,
      },
      quantity,
      deliveryMethod,
      subtotal,
      deliveryFee,
      discount,
      total: subtotal + deliveryFee - discount,
      status: "confirmed", // confirmed → shipping → delivered
      createdAt: new Date().toISOString(),
      /* Mock delivery progress (0-100) */
      deliveryProgress: 0,
    };

    const updated = [order, ...orders];
    await AsyncStorage.setItem(ORDER_KEY, JSON.stringify(updated));
    return order;
  } catch (e) {
    console.error("Error placing order:", e);
    return null;
  }
};

/**
 * Get latest active order (for map tracking).
 */
export const getLatestOrder = async () => {
  const orders = await getOrders();
  return orders.length > 0 ? orders[0] : null;
};
