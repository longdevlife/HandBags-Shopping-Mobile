import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Linking,
  Animated,
} from "react-native";
import MapView, { Marker, Polyline, AnimatedRegion } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "../components/CustomBottomSheet";
import { MapStyles as s } from "../styles/MapStyles";
import { getLatestOrder, getOrderById, updateOrderStatus, updateDeliveryProgress } from "../utils/orderStorage";
import useUserLocation from "../hooks/useUserLocation";
import { LUXURY_MAP_STYLE } from "../constants/mapStyle";

/* ══════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════ */

const STORES = [
  {
    id: 1,
    name: "LuxBag Saigon Centre",
    address: "65 Lê Lợi, Quận 1, TP.HCM",
    lat: 10.7731,
    lng: 106.7003,
    hours: "9:00 – 21:00",
    phone: "+84 28 3823 5678",
  },
  {
    id: 2,
    name: "LuxBag Landmark 81",
    address: "772 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    lat: 10.7955,
    lng: 106.7219,
    hours: "10:00 – 22:00",
    phone: "+84 28 3636 8181",
  },
  {
    id: 3,
    name: "LuxBag Phú Mỹ Hưng",
    address: "801 Nguyễn Văn Linh, Quận 7, TP.HCM",
    lat: 10.7293,
    lng: 106.7218,
    hours: "9:30 – 21:30",
    phone: "+84 28 5412 7800",
  },
];

const DRIVER_PHONE = "0901234567";

/* Warehouse origin point */
const WAREHOUSE = { latitude: 10.7769, longitude: 106.7009 };

/* Fallback customer destination (HCM center) */
const FALLBACK_DEST = { latitude: 10.79, longitude: 106.68 };

/**
 * Generate intermediate route points between two coordinates.
 * Creates smooth path with N intermediate steps.
 */
function generateRoute(start, end, steps = 8) {
  const route = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    route.push({
      latitude: start.latitude + (end.latitude - start.latitude) * t,
      longitude: start.longitude + (end.longitude - start.longitude) * t,
    });
  }
  return route;
}

/**
 * Calculate bearing (heading) in degrees from point A to point B.
 */
function calcHeading(from, to) {
  const toRad = (v) => (v * Math.PI) / 180;
  const toDeg = (v) => (v * 180) / Math.PI;
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

const DELIVERY_REGION = {
  latitude: 10.7835,
  longitude: 106.69,
  latitudeDelta: 0.022,
  longitudeDelta: 0.022,
};

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

/* Haversine distance (km) */
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ══════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════ */

export default function MapScreen({ navigation, route }) {
  const { location: userLoc } = useUserLocation();

  /* ── Shared state ── */
  const [order, setOrder] = useState(null);
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);

  /* ── Delivery tracking state ── */
  const [driverIndex, setDriverIndex] = useState(0);
  const [delivered, setDelivered] = useState(false);
  const [heading, setHeading] = useState(0);

  /* AnimatedRegion for smooth driver movement */
  const driverCoord = useRef(
    new AnimatedRegion({
      latitude: WAREHOUSE.latitude,
      longitude: WAREHOUSE.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;

  /* ── Build dynamic route from warehouse → order destination ── */
  const routeCoords = useMemo(() => {
    if (!order) return [];
    const dest =
      order.latitude != null && order.longitude != null
        ? { latitude: order.latitude, longitude: order.longitude }
        : FALLBACK_DEST;
    return generateRoute(WAREHOUSE, dest, 8);
  }, [order]);

  /* ── Delivery region centered between warehouse & customer ── */
  const deliveryRegion = useMemo(() => {
    if (routeCoords.length < 2) return DELIVERY_REGION;
    const start = routeCoords[0];
    const end = routeCoords[routeCoords.length - 1];
    return {
      latitude: (start.latitude + end.latitude) / 2,
      longitude: (start.longitude + end.longitude) / 2,
      latitudeDelta:
        Math.abs(start.latitude - end.latitude) * 1.6 + 0.005,
      longitudeDelta:
        Math.abs(start.longitude - end.longitude) * 1.6 + 0.005,
    };
  }, [routeCoords]);

  /* ── Store locator state ── */
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  /* ── Store data with distance ── */
  const storesWithDist = useMemo(
    () =>
      STORES.map((st) => ({
        ...st,
        distance: haversine(
          userLoc.latitude,
          userLoc.longitude,
          st.lat,
          st.lng,
        ),
      })).sort((a, b) => a.distance - b.distance),
    [userLoc.latitude, userLoc.longitude],
  );

  const selectedStore = useMemo(
    () => storesWithDist.find((st) => st.id === selectedStoreId) || null,
    [storesWithDist, selectedStoreId],
  );

  /* ── Snap points ── */
  const storeSnaps = useMemo(() => ["28%", "62%"], []);
  const deliverySnaps = useMemo(() => ["32%", "75%"], []);

  /* ── Load specific order (by param) or latest active delivery ── */
  useEffect(() => {
    const load = async () => {
      const paramOrderId = route.params?.orderId;
      let loaded = null;
      if (paramOrderId) {
        loaded = await getOrderById(paramOrderId);
        /* Clear param so next tab focus falls back to latest */
        navigation.setParams({ orderId: undefined });
      } else {
        loaded = await getLatestOrder();
      }
      /* If order is already delivered, show store locator instead */
      if (loaded && loaded.status === "delivered") {
        loaded = null;
      }
      setOrder(loaded);
      setDelivered(false);
      /* Driver position & index restored by simulation effect */
    };
    load();
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  /* ── Simulate driver along route with smooth animation ── */
  useEffect(() => {
    if (!order || delivered || routeCoords.length < 2) return;

    /* Restore saved progress from order storage */
    const savedIdx = Math.min(
      order.deliveryProgress || 0,
      routeCoords.length - 1,
    );
    setDriverIndex(savedIdx);

    /* Position driver at saved point immediately */
    if (savedIdx > 0 && savedIdx < routeCoords.length) {
      const pos = routeCoords[savedIdx];
      driverCoord.setValue({
        latitude: pos.latitude,
        longitude: pos.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
      setHeading(
        calcHeading(routeCoords[savedIdx - 1], routeCoords[savedIdx]),
      );
    } else {
      driverCoord.setValue({
        latitude: WAREHOUSE.latitude,
        longitude: WAREHOUSE.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
    }

    /* If already completed, mark delivered immediately */
    if (savedIdx >= routeCoords.length - 1) {
      updateOrderStatus(order.id, "delivered").then(() =>
        setDelivered(true),
      );
      return;
    }

    const interval = setInterval(() => {
      setDriverIndex((prev) => {
        if (prev >= routeCoords.length - 1) {
          clearInterval(interval);
          updateOrderStatus(order.id, "delivered").then(() =>
            setDelivered(true),
          );
          return prev;
        }
        const next = prev + 1;
        if (next === 1) updateOrderStatus(order.id, "shipping");

        /* Persist progress so it survives screen re-visits */
        updateDeliveryProgress(order.id, next);

        /* Calculate heading from current to next point */
        const h = calcHeading(routeCoords[prev], routeCoords[next]);
        setHeading(h);

        /* Smooth animate driver to next position */
        const dest = routeCoords[next];
        if (Platform.OS === "android") {
          driverCoord
            .timing({
              latitude: dest.latitude,
              longitude: dest.longitude,
              duration: 2000,
              useNativeDriver: false,
            })
            .start();
        } else {
          driverCoord
            .timing({
              latitude: dest.latitude,
              longitude: dest.longitude,
              latitudeDelta: 0,
              longitudeDelta: 0,
              duration: 2000,
              useNativeDriver: false,
            })
            .start();
        }

        /* Follow camera to driver */
        mapRef.current?.animateToRegion(
          {
            ...dest,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          },
          800,
        );
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [order, delivered, routeCoords]);

  /* ══════════════════════════════════════════
     ACTIONS
     ══════════════════════════════════════════ */

  const openNavigation = useCallback((store) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${store.lat},${store.lng}&q=${encodeURIComponent(store.name)}`,
      android: `google.navigation:q=${store.lat},${store.lng}`,
    });
    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`,
      );
    });
  }, []);

  const callPhone = useCallback((phone) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  }, []);

  const sendMessage = useCallback((phone) => {
    Linking.openURL(`sms:${phone.replace(/\s/g, "")}`);
  }, []);

  const handleStorePress = useCallback(
    (storeId) => {
      setSelectedStoreId(storeId);
      const store = STORES.find((st) => st.id === storeId);
      if (store) {
        mapRef.current?.animateToRegion(
          {
            latitude: store.lat,
            longitude: store.lng,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          },
          600,
        );
      }
      bottomSheetRef.current?.snapToIndex(1);
    },
    [],
  );

  /* ── Computed delivery values ── */
  const progress =
    routeCoords.length > 1
      ? (driverIndex / (routeCoords.length - 1)) * 100
      : 0;
  const activeStep =
    progress >= 100 ? 3 : progress >= 30 ? 2 : progress > 0 ? 1 : 0;
  const estimatedTime =
    progress >= 100
      ? "Arrived"
      : `~${Math.max(1, Math.round(((100 - progress) / 100) * 15))} min`;

  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  /* ══════════════════════════════════════════
     DELIVERY TRACKING MODE
     ══════════════════════════════════════════ */
  if (order) {
    return (
      <View style={s.container}>
        <MapView
          ref={mapRef}
          style={s.mapFull}
          initialRegion={deliveryRegion}
          customMapStyle={LUXURY_MAP_STYLE}
          showsUserLocation={false}
          showsCompass={false}
          toolbarEnabled={false}
        >
          {/* Warehouse */}
          <Marker
            coordinate={routeCoords[0] || WAREHOUSE}
            title="Warehouse"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={s.markerWarehouse}>
              <Ionicons name="cube" size={16} color="#fff" />
            </View>
          </Marker>

          {/* Customer — real coords from order */}
          <Marker
            coordinate={
              routeCoords[routeCoords.length - 1] || FALLBACK_DEST
            }
            title="Your Location"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={s.markerCustomer}>
              <Ionicons name="home" size={16} color="#fff" />
            </View>
          </Marker>

          {/* Driver — AnimatedRegion + heading rotation */}
          <Marker.Animated
            coordinate={driverCoord}
            title="Driver"
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={heading}
            flat
          >
            <View style={s.markerDriver}>
              <Ionicons name="bicycle" size={18} color="#fff" />
            </View>
          </Marker.Animated>

          {/* Route (dashed) */}
          {routeCoords.length >= 2 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="rgba(212,165,116,0.4)"
              strokeWidth={3}
              lineDashPattern={[6, 4]}
            />
          )}

          {/* Driver trail (solid green) */}
          {routeCoords.length >= 2 && driverIndex > 0 && (
            <Polyline
              coordinates={routeCoords.slice(0, driverIndex + 1)}
              strokeColor="#4CAF50"
              strokeWidth={4}
            />
          )}
        </MapView>

        {/* ── Bottom Sheet ── */}
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={deliverySnaps}
          index={0}
        >
          <ScrollView contentContainerStyle={s.sheetContent} showsVerticalScrollIndicator={false}>
            {/* ETA */}
            <View style={s.etaRow}>
              <View>
                <Text style={s.etaLabel}>Estimated Arrival</Text>
                <Text style={s.etaTime}>{estimatedTime}</Text>
              </View>
              <View style={s.progressPill}>
                <Text style={s.progressPillText}>
                  {Math.round(progress)}%
                </Text>
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
                    {i > 0 && (
                      <View
                        style={[
                          s.stepLine,
                          {
                            backgroundColor: isDone ? "#4CAF50" : "#E0E0E0",
                          },
                        ]}
                      />
                    )}
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
              <TouchableOpacity
                style={s.callBtn}
                activeOpacity={0.7}
                onPress={() => callPhone(DRIVER_PHONE)}
              >
                <Ionicons name="call-outline" size={18} color="#D4A574" />
              </TouchableOpacity>
              <TouchableOpacity
                style={s.msgBtn}
                activeOpacity={0.7}
                onPress={() => sendMessage(DRIVER_PHONE)}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={18}
                  color="#D4A574"
                />
              </TouchableOpacity>
            </View>

            {/* Order Item */}
            <View style={s.orderItemRow}>
              <Image
                source={{ uri: order.item.uri }}
                style={s.orderItemImage}
              />
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
        </CustomBottomSheet>

        {/* Delivered Overlay */}
        {delivered && (
          <View style={s.deliveredOverlay}>
            <View style={s.deliveredCard}>
              <View style={s.deliveredIconCircle}>
                <Ionicons name="checkmark-circle" size={44} color="#4CAF50" />
              </View>
              <Text style={s.deliveredTitle}>Delivered!</Text>
              <Text style={s.deliveredSubtitle}>
                Your {order.item.handbagName} has arrived. Enjoy your new
                handbag!
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

  /* ══════════════════════════════════════════
     STORE LOCATOR MODE  (no active delivery)
     ══════════════════════════════════════════ */
  const storeRegion = {
    latitude: userLoc.latitude,
    longitude: userLoc.longitude,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
  };

  return (
    <View style={s.container}>
      {/* Full‑screen map with store markers */}
      <MapView
        ref={mapRef}
        style={s.mapFull}
        initialRegion={storeRegion}
        customMapStyle={LUXURY_MAP_STYLE}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {storesWithDist.map((store) => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.lat, longitude: store.lng }}
            onPress={() => handleStorePress(store.id)}
          >
            <View
              style={[
                s.storeMarker,
                selectedStoreId === store.id && s.storeMarkerSelected,
              ]}
            >
              <Ionicons name="bag-handle" size={16} color="#fff" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floating header */}
      <View style={[s.floatingHeader, { top: statusBarH + 10 }]}>
        <View style={s.headerTitleWrap}>
          <Ionicons name="storefront" size={20} color="#D4A574" />
          <Text style={s.headerTitle}>LuxBag Stores</Text>
        </View>
        <TouchableOpacity
          style={s.locateBtn}
          activeOpacity={0.8}
          onPress={() =>
            mapRef.current?.animateToRegion(
              {
                latitude: userLoc.latitude,
                longitude: userLoc.longitude,
                latitudeDelta: 0.06,
                longitudeDelta: 0.06,
              },
              600,
            )
          }
        >
          <Ionicons name="locate" size={20} color="#D4A574" />
        </TouchableOpacity>
      </View>

      {/* ── Bottom Sheet: Store List / Detail ── */}
      <CustomBottomSheet
        ref={bottomSheetRef}
        snapPoints={storeSnaps}
        index={0}
      >
        <ScrollView contentContainerStyle={s.sheetContent} showsVerticalScrollIndicator={false}>
          {selectedStore ? (
            /* ──── Store Detail ──── */
            <View>
              <TouchableOpacity
                style={s.backToList}
                onPress={() => {
                  setSelectedStoreId(null);
                  bottomSheetRef.current?.snapToIndex(0);
                  mapRef.current?.animateToRegion(storeRegion, 600);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={18} color="#D4A574" />
                <Text style={s.backToListText}>All Stores</Text>
              </TouchableOpacity>

              {/* Header */}
              <View style={s.storeDetailHeader}>
                <View style={s.storeDetailIcon}>
                  <Ionicons name="storefront" size={28} color="#D4A574" />
                </View>
                <Text style={s.storeDetailName}>{selectedStore.name}</Text>
                <Text style={s.storeDetailAddress}>
                  {selectedStore.address}
                </Text>
              </View>

              {/* Info Grid */}
              <View style={s.storeInfoGrid}>
                <View style={s.storeInfoItem}>
                  <View style={s.storeInfoIconWrap}>
                    <Ionicons name="time-outline" size={18} color="#D4A574" />
                  </View>
                  <View>
                    <Text style={s.storeInfoLabel}>Opening Hours</Text>
                    <Text style={s.storeInfoValue}>{selectedStore.hours}</Text>
                  </View>
                </View>

                <View style={s.storeInfoItem}>
                  <View style={s.storeInfoIconWrap}>
                    <Ionicons
                      name="navigate-outline"
                      size={18}
                      color="#D4A574"
                    />
                  </View>
                  <View>
                    <Text style={s.storeInfoLabel}>Distance</Text>
                    <Text style={s.storeInfoValue}>
                      {selectedStore.distance.toFixed(1)} km from you
                    </Text>
                  </View>
                </View>

                <View style={s.storeInfoItem}>
                  <View style={s.storeInfoIconWrap}>
                    <Ionicons name="call-outline" size={18} color="#D4A574" />
                  </View>
                  <View>
                    <Text style={s.storeInfoLabel}>Phone</Text>
                    <Text style={s.storeInfoValue}>{selectedStore.phone}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={s.storeActions}>
                <TouchableOpacity
                  style={s.storeActionPrimary}
                  activeOpacity={0.85}
                  onPress={() => openNavigation(selectedStore)}
                >
                  <Ionicons name="navigate" size={18} color="#fff" />
                  <Text style={s.storeActionPrimaryText}>Navigate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.storeActionSecondary}
                  activeOpacity={0.85}
                  onPress={() => callPhone(selectedStore.phone)}
                >
                  <Ionicons name="call" size={18} color="#D4A574" />
                  <Text style={s.storeActionSecondaryText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.storeActionSecondary}
                  activeOpacity={0.85}
                  onPress={() => sendMessage(selectedStore.phone)}
                >
                  <Ionicons name="chatbubble" size={18} color="#D4A574" />
                  <Text style={s.storeActionSecondaryText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ──── Store List ──── */
            <View>
              <Text style={s.storeListTitle}>Nearby Stores</Text>
              <Text style={s.storeListSubtitle}>
                {storesWithDist.length} LuxBag stores near you
              </Text>

              {storesWithDist.map((store) => (
                <TouchableOpacity
                  key={store.id}
                  style={s.storeCard}
                  activeOpacity={0.8}
                  onPress={() => handleStorePress(store.id)}
                >
                  <View style={s.storeCardIcon}>
                    <Ionicons name="storefront" size={22} color="#D4A574" />
                  </View>
                  <View style={s.storeCardInfo}>
                    <Text style={s.storeCardName}>{store.name}</Text>
                    <Text style={s.storeCardAddress} numberOfLines={1}>
                      {store.address}
                    </Text>
                    <View style={s.storeCardMeta}>
                      <Ionicons name="time-outline" size={12} color="#999" />
                      <Text style={s.storeCardMetaText}>{store.hours}</Text>
                      <View style={s.storeCardDot} />
                      <Ionicons
                        name="navigate-outline"
                        size={12}
                        color="#999"
                      />
                      <Text style={s.storeCardMetaText}>
                        {store.distance.toFixed(1)} km
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CCC" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </CustomBottomSheet>
    </View>
  );
}
