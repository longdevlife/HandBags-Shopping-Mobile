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
 * Pick-up orders start as "ready_pickup", deliver orders start as "confirmed".
 * @param {object} item - product info
 * @param {number} quantity
 * @param {string} deliveryMethod - "deliver" | "pickup"
 * @param {object} [extra] - { storeName, storeAddress } for pickup
 */
export const placeOrder = async (
  item,
  quantity,
  deliveryMethod,
  extra = {},
) => {
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
      status: deliveryMethod === "pickup" ? "ready_pickup" : "confirmed",
      createdAt: new Date().toISOString(),
      deliveryProgress: 0,
      /* Store info for pickup orders */
      ...(extra.storeName && {
        storeName: extra.storeName,
        storeAddress: extra.storeAddress,
      }),
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
 * Update the status of a specific order by id.
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orders = await getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return false;
    orders[idx].status = newStatus;
    if (newStatus === "delivered" || newStatus === "picked_up") {
      orders[idx].completedAt = new Date().toISOString();
    }
    await AsyncStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    return true;
  } catch (e) {
    console.error("Error updating order status:", e);
    return false;
  }
};

/**
 * Get latest active DELIVERY order (for map tracking).
 * Only returns deliver orders that are not yet delivered.
 */
export const getLatestOrder = async () => {
  const orders = await getOrders();
  return (
    orders.find(
      (o) => o.deliveryMethod === "deliver" && o.status !== "delivered",
    ) || null
  );
};
