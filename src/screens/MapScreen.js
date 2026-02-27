import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { MapStyles as s } from "../styles/MapStyles";
import { getLatestOrder, updateOrderStatus } from "../utils/orderStorage";

/* ── Mock route: warehouse → customer (Ho Chi Minh City) ── */
const ROUTE_COORDS = [
  { latitude: 10.7769, longitude: 106.7009 },
  { latitude: 10.7785, longitude: 106.697 },
  { latitude: 10.78, longitude: 106.694 },
  { latitude: 10.7815, longitude: 106.692 },
  { latitude: 10.7835, longitude: 106.6895 },
  { latitude: 10.7855, longitude: 106.687 },
  { latitude: 10.787, longitude: 106.6845 },
  { latitude: 10.7885, longitude: 106.6825 },
  { latitude: 10.79, longitude: 106.68 },
];

const DELIVERY_REGION = {
  latitude: 10.7835,
  longitude: 106.69,
  latitudeDelta: 0.022,
  longitudeDelta: 0.022,
};

/* ── Delivery Steps ── */
const STEPS = [
  {
    key: "confirmed",
    icon: "checkmark-circle",
    label: "Order Confirmed",
    desc: "Your order has been received",
  },
  {
    key: "preparing",
    icon: "cube",
    label: "Preparing",
    desc: "Packing your handbag",
  },
  {
    key: "shipping",
    icon: "bicycle",
    label: "On the Way",
    desc: "Driver is heading to you",
  },
  {
    key: "delivered",
    icon: "home",
    label: "Delivered",
    desc: "Enjoy your new handbag!",
  },
];

export default function MapScreen({ navigation }) {
  const [order, setOrder] = useState(null);
  const [driverIndex, setDriverIndex] = useState(0);
  const [delivered, setDelivered] = useState(false);
  const mapRef = useRef(null);

  /* Load latest ACTIVE delivery order */
  useEffect(() => {
    const load = async () => {
      const latest = await getLatestOrder();
      setOrder(latest);
      setDelivered(false);
      setDriverIndex(0);
    };
    load();
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  /* Simulate driver moving along route */
  useEffect(() => {
    if (!order || delivered) return;
    setDriverIndex(0);

    const interval = setInterval(() => {
      setDriverIndex((prev) => {
        if (prev >= ROUTE_COORDS.length - 1) {
          clearInterval(interval);
          /* Auto-mark as delivered */
          updateOrderStatus(order.id, "delivered").then(() => {
            setDelivered(true);
          });
          return prev;
        }
        const next = prev + 1;
        /* Update status to "shipping" once driver starts moving */
        if (next === 1) {
          updateOrderStatus(order.id, "shipping");
        }
        /* Animate camera to follow driver */
        mapRef.current?.animateToRegion(
          {
            ...ROUTE_COORDS[next],
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          },
          800,
        );
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [order, delivered]);

  const progress =
    ROUTE_COORDS.length > 1
      ? (driverIndex / (ROUTE_COORDS.length - 1)) * 100
      : 0;

  /* Which step is active (0-3) */
  const activeStep =
    progress >= 100 ? 3 : progress >= 30 ? 2 : progress > 0 ? 1 : 0;

  const estimatedTime =
    progress >= 100
      ? "Arrived"
      : `~${Math.max(1, Math.round(((100 - progress) / 100) * 15))} min`;

  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  /* Empty state */
  if (!order) {
    return (
      <View style={[s.emptyContainer, { paddingTop: statusBarH }]}>
        <View style={s.emptyIconCircle}>
          <Ionicons name="map-outline" size={40} color="#D4A574" />
        </View>
        <Text style={s.emptyTitle}>No Active Deliveries</Text>
        <Text style={s.emptySubtitle}>
          When you place a delivery order, you can{"\n"}track your shipment here
          in real-time.{"\n\n"}Pick-up orders don't need tracking.
        </Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={s.map}
        initialRegion={DELIVERY_REGION}
        showsUserLocation={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {/* Warehouse marker */}
        <Marker
          coordinate={ROUTE_COORDS[0]}
          title="Warehouse"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={s.markerWarehouse}>
            <Ionicons name="cube" size={16} color="#fff" />
          </View>
        </Marker>

        {/* Customer marker */}
        <Marker
          coordinate={ROUTE_COORDS[ROUTE_COORDS.length - 1]}
          title="Your Location"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={s.markerCustomer}>
            <Ionicons name="home" size={16} color="#fff" />
          </View>
        </Marker>

        {/* Driver marker */}
        <Marker
          coordinate={ROUTE_COORDS[driverIndex]}
          title="Driver"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={s.markerDriver}>
            <Ionicons name="bicycle" size={18} color="#fff" />
          </View>
        </Marker>

        {/* Route line (dashed) */}
        <Polyline
          coordinates={ROUTE_COORDS}
          strokeColor="rgba(212,165,116,0.4)"
          strokeWidth={3}
          lineDashPattern={[6, 4]}
        />

        {/* Driver trail (solid green) */}
        <Polyline
          coordinates={ROUTE_COORDS.slice(0, driverIndex + 1)}
          strokeColor="#4CAF50"
          strokeWidth={4}
        />
      </MapView>

      {/* Bottom Sheet */}
      <ScrollView style={s.sheet} showsVerticalScrollIndicator={false}>
        <View style={s.handle} />

        {/* ETA Header */}
        <View style={s.etaRow}>
          <View>
            <Text style={s.etaLabel}>Estimated Arrival</Text>
            <Text style={s.etaTime}>{estimatedTime}</Text>
          </View>
          <View style={s.progressPill}>
            <Text style={s.progressPillText}>{Math.round(progress)}%</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={s.progressBarBg}>
          <View
            style={[
              s.progressBarFill,
              { width: `${Math.min(100, progress)}%` },
            ]}
          />
        </View>

        {/* Delivery Steps */}
        <View style={s.stepsContainer}>
          {STEPS.map((step, i) => {
            const isDone = i <= activeStep;
            const isActive = i === activeStep;
            return (
              <View key={step.key} style={s.stepRow}>
                {/* Line connector */}
                {i > 0 && (
                  <View
                    style={[
                      s.stepLine,
                      { backgroundColor: isDone ? "#4CAF50" : "#E0E0E0" },
                    ]}
                  />
                )}
                {/* Icon circle */}
                <View
                  style={[
                    s.stepCircle,
                    isDone && s.stepCircleDone,
                    isActive && s.stepCircleActive,
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={16}
                    color={isDone ? "#fff" : "#CCC"}
                  />
                </View>
                {/* Text */}
                <View style={s.stepTextWrap}>
                  <Text
                    style={[
                      s.stepLabel,
                      isDone && { color: "#1B1B1B" },
                      isActive && { color: "#D4A574" },
                    ]}
                  >
                    {step.label}
                  </Text>
                  <Text style={s.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Driver Info */}
        <View style={s.driverCard}>
          <View style={s.driverAvatar}>
            <Text style={s.driverAvatarText}>A</Text>
          </View>
          <View style={s.driverInfo}>
            <Text style={s.driverName}>Alex Johnson</Text>
            <Text style={s.driverRole}>Personal Courier</Text>
          </View>
          <TouchableOpacity style={s.callBtn} activeOpacity={0.7}>
            <Ionicons name="call-outline" size={18} color="#D4A574" />
          </TouchableOpacity>
          <TouchableOpacity style={s.msgBtn} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={18} color="#D4A574" />
          </TouchableOpacity>
        </View>

        {/* Order Item */}
        <View style={s.orderItemRow}>
          <Image source={{ uri: order.item.uri }} style={s.orderItemImage} />
          <View style={{ flex: 1 }}>
            <Text style={s.orderItemName} numberOfLines={1}>
              {order.item.handbagName}
            </Text>
            <Text style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
              {order.item.brand} · Qty: {order.quantity}
            </Text>
          </View>
          <Text style={s.orderItemPrice}>
            ${" "}
            {order.total?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      </ScrollView>

      {/* Delivered Overlay */}
      {delivered && (
        <View style={s.deliveredOverlay}>
          <View style={s.deliveredCard}>
            <View style={s.deliveredIconCircle}>
              <Ionicons name="checkmark-circle" size={44} color="#4CAF50" />
            </View>
            <Text style={s.deliveredTitle}>Delivered!</Text>
            <Text style={s.deliveredSubtitle}>
              Your {order.item.handbagName} has arrived. Enjoy your new handbag!
            </Text>
            <TouchableOpacity
              style={s.deliveredBtn}
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.85}
            >
              <Text style={s.deliveredBtnText}>Back to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.deliveredSecondary}
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Orders" })
              }
              activeOpacity={0.8}
            >
              <Text style={s.deliveredSecondaryText}>View My Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
