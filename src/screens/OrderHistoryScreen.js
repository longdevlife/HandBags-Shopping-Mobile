import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getOrders, updateOrderStatus } from "../utils/orderStorage";
import { OrderHistoryStyles as s } from "../styles/OrderHistoryStyles";

export default function OrderHistoryScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // all | delivering | completed

  /* Reload every time screen is focused */
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getOrders();
        setOrders(data);
      })();
    }, []),
  );

  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  /* Filter orders by tab */
  const COMPLETED = ["delivered", "picked_up"];
  const filtered =
    activeTab === "all"
      ? orders
      : activeTab === "delivering"
        ? orders.filter((o) => !COMPLETED.includes(o.status))
        : orders.filter((o) => COMPLETED.includes(o.status));

  /* Status badge info */
  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Confirmed",
          color: "#F5A623",
          bg: "rgba(245,166,35,0.1)",
        };
      case "shipping":
        return {
          label: "Shipping",
          color: "#4D96FF",
          bg: "rgba(77,150,255,0.1)",
        };
      case "delivered":
        return {
          label: "Delivered",
          color: "#4CAF50",
          bg: "rgba(76,175,80,0.1)",
        };
      case "ready_pickup":
        return {
          label: "Ready for Pickup",
          color: "#D4A574",
          bg: "rgba(212,165,116,0.1)",
        };
      case "picked_up":
        return {
          label: "Picked Up",
          color: "#4CAF50",
          bg: "rgba(76,175,80,0.1)",
        };
      default:
        return {
          label: "Processing",
          color: "#999",
          bg: "rgba(153,153,153,0.1)",
        };
    }
  };

  /* Format date */
  const formatDate = (isoString) => {
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

  /* Handle "I Picked Up" confirmation */
  const confirmPickup = (orderId) => {
    Alert.alert(
      "Confirm Pickup",
      "Have you picked up this order from the store?",
      [
        { text: "Not yet", style: "cancel" },
        {
          text: "Yes, I got it",
          onPress: async () => {
            await updateOrderStatus(orderId, "picked_up");
            const data = await getOrders();
            setOrders(data);
          },
        },
      ],
    );
  };

  const renderOrder = ({ item: order }) => {
    const sc = getStatusConfig(order.status);
    const isCompleted =
      order.status === "delivered" || order.status === "picked_up";
    const isPickup = order.deliveryMethod === "pickup";

    return (
      <TouchableOpacity
        style={s.orderCard}
        activeOpacity={0.85}
        onPress={() => {
          if (!isPickup && !isCompleted) {
            navigation.navigate("Map", { orderId: order.id });
          } else {
            navigation.navigate("OrderDetail", { order });
          }
        }}
      >
        <View style={s.cardTop}>
          <Image source={{ uri: order.item.uri }} style={s.orderImage} />
          <View style={s.orderInfo}>
            <Text style={s.orderName} numberOfLines={1}>
              {order.item.handbagName}
            </Text>
            <Text style={s.orderBrand}>
              {order.item.brand} · {order.item.category}
            </Text>
            <View style={s.qtyDateRow}>
              <Text style={s.orderQty}>Qty: {order.quantity}</Text>
              <Text style={s.orderDate}>{formatDate(order.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={s.cardBottom}>
          <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
            <View style={[s.statusDotSmall, { backgroundColor: sc.color }]} />
            <Text style={[s.statusLabel, { color: sc.color }]}>{sc.label}</Text>
          </View>
          <View style={s.priceRow}>
            <Text style={s.deliveryLabel}>
              {isPickup ? "Pick Up" : "Deliver"}
            </Text>
            <Text style={s.orderTotal}>
              ${" "}
              {order.total?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* Store info for pickup orders */}
        {isPickup && order.storeName && (
          <View style={s.storeInfoRow}>
            <Ionicons name="storefront-outline" size={14} color="#D4A574" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={s.storeInfoName}>{order.storeName}</Text>
              <Text style={s.storeInfoAddr} numberOfLines={1}>
                {order.storeAddress}
              </Text>
            </View>
          </View>
        )}

        {/* Actions — different for Deliver vs Pick Up */}
        {!isCompleted && !isPickup && (
          <View style={s.trackRow}>
            <Ionicons name="navigate-outline" size={14} color="#D4A574" />
            <Text style={s.trackText}>Track Order</Text>
            <Ionicons name="chevron-forward" size={14} color="#D4A574" />
          </View>
        )}

        {isPickup && order.status === "ready_pickup" && (
          <TouchableOpacity
            style={s.pickupRow}
            onPress={() => confirmPickup(order.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="bag-check-outline" size={14} color="#4CAF50" />
            <Text style={s.pickupText}>I Picked Up</Text>
            <Ionicons name="chevron-forward" size={14} color="#4CAF50" />
          </TouchableOpacity>
        )}

        {isCompleted && (
          <View style={s.completedRow}>
            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
            <Text style={s.completedText}>
              {order.status === "delivered" ? "Delivered" : "Picked Up"}
              {order.completedAt ? ` · ${formatDate(order.completedAt)}` : ""}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[s.container, { paddingTop: statusBarH }]}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerIcon}>
          <Ionicons name="bag-handle" size={18} color="#fff" />
        </View>
        <Text style={s.headerTitle}>My Orders</Text>
        <Text style={s.headerCount}>({orders.length})</Text>
      </View>

      {/* Filter Tabs */}
      <View style={s.tabRow}>
        {[
          { key: "all", label: "All" },
          { key: "delivering", label: "Active" },
          { key: "completed", label: "Completed" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[s.tabBtn, activeTab === tab.key && s.tabBtnActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={
          filtered.length === 0 ? s.emptyContainer : s.listPad
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIconCircle}>
              <Ionicons name="bag-handle-outline" size={48} color="#D4A574" />
            </View>
            <Text style={s.emptyTitle}>
              {activeTab === "completed"
                ? "No completed orders"
                : activeTab === "delivering"
                  ? "No active orders"
                  : "No orders yet"}
            </Text>
            <Text style={s.emptySubtitle}>
              Your orders will appear here after you make a purchase
            </Text>
            <TouchableOpacity
              style={s.browseBtn}
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.85}
            >
              <Text style={s.browseBtnText}>Browse Handbags</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
