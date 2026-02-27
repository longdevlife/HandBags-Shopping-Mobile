import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderDetailStyles as s } from "../styles/OrderDetailStyles";

/* ── Status config ── */
const getStatusConfig = (status) => {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmed",
        color: "#F5A623",
        bg: "rgba(245,166,35,0.1)",
        icon: "checkmark-circle",
      };
    case "shipping":
      return {
        label: "Shipping",
        color: "#4D96FF",
        bg: "rgba(77,150,255,0.1)",
        icon: "bicycle",
      };
    case "delivered":
      return {
        label: "Delivered",
        color: "#4CAF50",
        bg: "rgba(76,175,80,0.1)",
        icon: "checkmark-done-circle",
      };
    case "ready_pickup":
      return {
        label: "Ready for Pickup",
        color: "#D4A574",
        bg: "rgba(212,165,116,0.1)",
        icon: "storefront",
      };
    case "picked_up":
      return {
        label: "Picked Up",
        color: "#4CAF50",
        bg: "rgba(76,175,80,0.1)",
        icon: "bag-check",
      };
    default:
      return {
        label: "Processing",
        color: "#999",
        bg: "rgba(153,153,153,0.1)",
        icon: "time",
      };
  }
};

/* ── Format date helpers ── */
const formatFullDate = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelative = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params;
  const sc = getStatusConfig(order.status);
  const isPickup = order.deliveryMethod === "pickup";
  const isCompleted =
    order.status === "delivered" || order.status === "picked_up";

  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  return (
    <View style={[s.container, { paddingTop: statusBarH }]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          style={s.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={24} color="#1B1B1B" />
        </Pressable>
        <Text style={s.headerTitle}>Order Details</Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Status Banner ── */}
        <View style={[s.statusBanner, { backgroundColor: sc.bg }]}>
          <View style={[s.statusIconCircle, { backgroundColor: sc.color }]}>
            <Ionicons name={sc.icon} size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.statusTitle, { color: sc.color }]}>{sc.label}</Text>
            <Text style={s.statusDate}>
              {isCompleted && order.completedAt
                ? formatRelative(order.completedAt)
                : formatRelative(order.createdAt)}
            </Text>
          </View>
          <View style={[s.methodBadge, isPickup && s.methodBadgePickup]}>
            <Ionicons
              name={isPickup ? "storefront-outline" : "car-outline"}
              size={14}
              color={isPickup ? "#D4A574" : "#4D96FF"}
            />
            <Text
              style={[s.methodBadgeText, isPickup && s.methodBadgeTextPickup]}
            >
              {isPickup ? "Pick Up" : "Delivery"}
            </Text>
          </View>
        </View>

        {/* ── Product Card ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Product</Text>
          <View style={s.productCard}>
            <Image source={{ uri: order.item.uri }} style={s.productImage} />
            <View style={s.productInfo}>
              <Text style={s.productBrand}>{order.item.brand}</Text>
              <Text style={s.productName} numberOfLines={2}>
                {order.item.handbagName}
              </Text>
              <Text style={s.productCategory}>{order.item.category}</Text>
              <View style={s.productBottom}>
                <Text style={s.productPrice}>
                  $ {order.item.cost?.toLocaleString()}
                </Text>
                <Text style={s.productQty}>×{order.quantity}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Delivery / Pickup Info ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            {isPickup ? "Pickup Location" : "Delivery Info"}
          </Text>
          <View style={s.infoCard}>
            {isPickup ? (
              <>
                <View style={s.infoRow}>
                  <View style={s.infoIconWrap}>
                    <Ionicons name="storefront" size={18} color="#D4A574" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.infoLabel}>Store</Text>
                    <Text style={s.infoValue}>{order.storeName || "—"}</Text>
                    {order.storeAddress && (
                      <Text style={s.infoSub}>{order.storeAddress}</Text>
                    )}
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={s.infoRow}>
                  <View style={s.infoIconWrap}>
                    <Ionicons name="location" size={18} color="#D4A574" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.infoLabel}>Destination</Text>
                    <Text style={s.infoValue}>
                      {order.latitude != null
                        ? `${order.latitude.toFixed(4)}, ${order.longitude.toFixed(4)}`
                        : "Default address"}
                    </Text>
                  </View>
                </View>
                <View style={s.infoSeparator} />
                <View style={s.infoRow}>
                  <View style={s.infoIconWrap}>
                    <Ionicons name="person" size={18} color="#D4A574" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.infoLabel}>Courier</Text>
                    <Text style={s.infoValue}>Alex Johnson</Text>
                    <Text style={s.infoSub}>Personal Courier</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* ── Timeline ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Timeline</Text>
          <View style={s.timelineCard}>
            {/* Created */}
            <View style={s.timelineItem}>
              <View style={[s.timelineDot, { backgroundColor: "#D4A574" }]} />
              <View style={s.timelineContent}>
                <Text style={s.timelineLabel}>Order Placed</Text>
                <Text style={s.timelineDate}>
                  {formatFullDate(order.createdAt)}
                </Text>
              </View>
            </View>

            {/* Status-specific steps */}
            {!isPickup && (
              <View style={s.timelineItem}>
                <View
                  style={[
                    s.timelineDot,
                    {
                      backgroundColor:
                        order.status === "shipping" ||
                        order.status === "delivered"
                          ? "#4D96FF"
                          : "#E0E0E0",
                    },
                  ]}
                />
                <View style={s.timelineContent}>
                  <Text
                    style={[
                      s.timelineLabel,
                      order.status !== "shipping" &&
                        order.status !== "delivered" && { color: "#CCC" },
                    ]}
                  >
                    Out for Delivery
                  </Text>
                </View>
              </View>
            )}

            {/* Completed */}
            {isCompleted && (
              <View style={s.timelineItem}>
                <View style={[s.timelineDot, { backgroundColor: "#4CAF50" }]} />
                <View style={s.timelineContent}>
                  <Text style={[s.timelineLabel, { color: "#4CAF50" }]}>
                    {order.status === "delivered" ? "Delivered" : "Picked Up"}
                  </Text>
                  {order.completedAt && (
                    <Text style={s.timelineDate}>
                      {formatFullDate(order.completedAt)}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── Payment Summary ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Payment Summary</Text>
          <View style={s.summaryCard}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>
                Price ({order.quantity} item{order.quantity > 1 ? "s" : ""})
              </Text>
              <Text style={s.summaryValue}>
                ${" "}
                {order.subtotal?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
            {order.deliveryFee > 0 && (
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Delivery Fee</Text>
                <Text style={s.summaryValue}>
                  $ {order.deliveryFee?.toFixed(2)}
                </Text>
              </View>
            )}
            {order.discount > 0 && (
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Discount</Text>
                <Text style={[s.summaryValue, { color: "#4CAF50" }]}>
                  -$ {order.discount?.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalValue}>
                ${" "}
                {order.total?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={s.paymentMethod}>
              <View style={s.paymentIconWrap}>
                <Ionicons name="wallet" size={16} color="#fff" />
              </View>
              <Text style={s.paymentText}>Cash / Wallet</Text>
            </View>
          </View>
        </View>

        {/* ── Order ID ── */}
        <View style={s.orderIdRow}>
          <Text style={s.orderIdLabel}>Order ID</Text>
          <Text style={s.orderIdValue}>{order.id}</Text>
        </View>
      </ScrollView>

      {/* ── Bottom Action ── */}
      {!isCompleted && !isPickup && (
        <View style={s.bottomBar}>
          <TouchableOpacity
            style={s.actionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Map", { orderId: order.id })}
          >
            <Ionicons name="navigate" size={18} color="#fff" />
            <Text style={s.actionBtnText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
