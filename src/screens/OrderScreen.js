import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrderStyles as s } from "../styles/OrderStyles";
import { placeOrder } from "../utils/orderStorage";

/* ── Mock stores for Pick Up ── */
const STORES = [
  {
    id: 1,
    name: "LuxBag Saigon Centre",
    address: "65 Lê Lợi, Quận 1, TP.HCM",
    lat: 10.7731,
    lng: 106.7003,
    hours: "9:00 – 21:00",
  },
  {
    id: 2,
    name: "LuxBag Landmark 81",
    address: "772 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    lat: 10.7955,
    lng: 106.7219,
    hours: "10:00 – 22:00",
  },
  {
    id: 3,
    name: "LuxBag Phú Mỹ Hưng",
    address: "801 Nguyễn Văn Linh, Quận 7, TP.HCM",
    lat: 10.7293,
    lng: 106.7218,
    hours: "9:30 – 21:30",
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

/* Default user coord (mock – center HCM) */
const USER_LAT = 10.7769;
const USER_LNG = 106.7009;

export default function OrderScreen({ route, navigation }) {
  const { item, selectedAddress } = route.params;

  const [deliveryMethod, setDeliveryMethod] = useState("deliver");
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  /* ── Address state ── */
  const [address, setAddress] = useState({
    name: "Jl. Kpg Sutoyo",
    detail: "Kpg. Sutoyo No. 620, Bilzen, Tanjungbalai.",
    latitude: USER_LAT,
    longitude: USER_LNG,
  });

  /* If user returned from AddressPicker, update address */
  useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress);
    }
  }, [selectedAddress]);

  /* ── Note state ── */
  const [note, setNote] = useState("");
  const [noteModal, setNoteModal] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  /* ── Pick-up store ── */
  const storesWithDist = STORES.map((st) => ({
    ...st,
    distance: haversine(USER_LAT, USER_LNG, st.lat, st.lng),
  })).sort((a, b) => a.distance - b.distance);

  const [selectedStore, setSelectedStore] = useState(storesWithDist[0]?.id);

  /* ── Pricing ── */
  const subtotal = item.cost * quantity;
  const deliveryFee = deliveryMethod === "deliver" ? 2.0 : 0;
  const discount = deliveryMethod === "deliver" ? 1.0 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleOrder = async () => {
    const order = await placeOrder(item, quantity, deliveryMethod);
    if (order) {
      setOrderResult(order);
      setShowSuccess(true);
    } else {
      Alert.alert("Error", "Failed to place order. Please try again.");
    }
  };

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
        <Text style={s.headerTitle}>Order</Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Deliver / Pick Up Toggle */}
        <View style={s.toggleRow}>
          <TouchableOpacity
            style={[
              s.toggleBtn,
              deliveryMethod === "deliver" && s.toggleBtnActive,
            ]}
            onPress={() => setDeliveryMethod("deliver")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                s.toggleText,
                deliveryMethod === "deliver" && s.toggleTextActive,
              ]}
            >
              Deliver
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.toggleBtn,
              deliveryMethod === "pickup" && s.toggleBtnActive,
            ]}
            onPress={() => setDeliveryMethod("pickup")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                s.toggleText,
                deliveryMethod === "pickup" && s.toggleTextActive,
              ]}
            >
              Pick Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* ──── DELIVER: Address ──── */}
        {deliveryMethod === "deliver" && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Delivery Address</Text>
            <View style={s.addressCard}>
              <Text style={s.addressName}>{address.name}</Text>
              <Text style={s.addressDetail}>{address.detail}</Text>
              {note !== "" && (
                <View style={s.notePreview}>
                  <Ionicons name="document-text" size={12} color="#D4A574" />
                  <Text style={s.notePreviewText} numberOfLines={1}>
                    {note}
                  </Text>
                </View>
              )}
              <View style={s.addressActions}>
                <TouchableOpacity
                  style={s.addressActionBtn}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate("AddressPicker", {
                      item,
                      currentAddress: address,
                    })
                  }
                >
                  <Ionicons name="map-outline" size={14} color="#D4A574" />
                  <Text style={[s.addressActionText, { color: "#D4A574" }]}>
                    Choose on Map
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.addressActionBtn}
                  activeOpacity={0.7}
                  onPress={() => {
                    setNoteDraft(note);
                    setNoteModal(true);
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={14}
                    color={note ? "#D4A574" : "#666"}
                  />
                  <Text
                    style={[s.addressActionText, note && { color: "#D4A574" }]}
                  >
                    {note ? "Edit Note" : "Add Note"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ──── PICK UP: Store Selector ──── */}
        {deliveryMethod === "pickup" && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Nearest Stores</Text>
            {storesWithDist.map((store) => {
              const active = selectedStore === store.id;
              return (
                <TouchableOpacity
                  key={store.id}
                  style={[s.storeCard, active && s.storeCardActive]}
                  onPress={() => setSelectedStore(store.id)}
                  activeOpacity={0.8}
                >
                  <View style={s.storeRadio}>
                    {active && <View style={s.storeRadioDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.storeName}>{store.name}</Text>
                    <Text style={s.storeAddr}>{store.address}</Text>
                    <View style={s.storeMeta}>
                      <Ionicons name="time-outline" size={12} color="#999" />
                      <Text style={s.storeMetaText}>{store.hours}</Text>
                      <Ionicons
                        name="location-outline"
                        size={12}
                        color="#D4A574"
                        style={{ marginLeft: 10 }}
                      />
                      <Text style={[s.storeMetaText, { color: "#D4A574" }]}>
                        {store.distance.toFixed(1)} km
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Product Item */}
        <View style={s.section}>
          <View style={s.itemCard}>
            <Image source={{ uri: item.uri }} style={s.itemImage} />
            <View style={s.itemInfo}>
              <Text style={s.itemName} numberOfLines={1}>
                {item.handbagName}
              </Text>
              <Text style={s.itemCategory}>{item.category}</Text>
            </View>
            <View style={s.quantityRow}>
              <Pressable
                style={s.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={16} color="#1B1B1B" />
              </Pressable>
              <Text style={s.qtyText}>{quantity}</Text>
              <Pressable
                style={s.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={16} color="#1B1B1B" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Discount Row */}
        <Pressable style={s.discountRow}>
          <View style={s.discountLeft}>
            <Ionicons name="pricetag-outline" size={18} color="#D4A574" />
            <Text style={s.discountText}>1 Discount is Applied</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </Pressable>

        {/* Payment Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Payment Summary</Text>
          <View style={s.summaryCard}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Price</Text>
              <Text style={s.summaryValue}>
                ${" "}
                {subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
            {deliveryMethod === "deliver" && (
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Delivery Fee</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={s.summaryOld}>$ {deliveryFee.toFixed(1)}</Text>
                  <Text style={s.summaryDiscount}>
                    $ {(deliveryFee - discount).toFixed(1)}
                  </Text>
                </View>
              </View>
            )}
            <View style={s.divider} />
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total Payment</Text>
              <Text style={s.totalValue}>
                ${" "}
                {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <Pressable style={s.paymentRow}>
          <View style={s.paymentLeft}>
            <View style={s.paymentIcon}>
              <Ionicons name="wallet-outline" size={18} color="#fff" />
            </View>
            <View>
              <Text style={s.paymentName}>Cash/Wallet</Text>
              <Text style={s.paymentAmount}>
                ${" "}
                {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={18} color="#999" />
        </Pressable>
      </ScrollView>

      {/* Bottom Button */}
      <View style={s.bottomBar}>
        <TouchableOpacity
          style={s.orderBtn}
          onPress={handleOrder}
          activeOpacity={0.85}
        >
          <Text style={s.orderBtnText}>Order</Text>
        </TouchableOpacity>
      </View>

      {/* ── Add Note Modal ── */}
      <Modal visible={noteModal} transparent animationType="fade">
        <Pressable style={s.noteOverlay} onPress={() => setNoteModal(false)}>
          <Pressable style={s.noteCard} onPress={() => {}}>
            <Text style={s.noteCardTitle}>Delivery Note</Text>
            <Text style={s.noteCardSubtitle}>
              Add instructions for the driver (e.g. apartment, gate code)
            </Text>
            <TextInput
              style={s.noteInput}
              placeholder="Leave at the door, call when arriving…"
              placeholderTextColor="#CCC"
              multiline
              maxLength={200}
              value={noteDraft}
              onChangeText={setNoteDraft}
              autoFocus
            />
            <View style={s.noteActions}>
              <TouchableOpacity
                style={s.noteCancelBtn}
                onPress={() => setNoteModal(false)}
              >
                <Text style={s.noteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.noteSaveBtn}
                onPress={() => {
                  setNote(noteDraft.trim());
                  setNoteModal(false);
                }}
              >
                <Text style={s.noteSaveText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Success Overlay */}
      {showSuccess && (
        <View style={s.successOverlay}>
          <View style={s.successCard}>
            <View style={s.successIcon}>
              <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            </View>
            <Text style={s.successTitle}>Order Successful!</Text>
            <Text style={s.successSubtitle}>
              {deliveryMethod === "deliver"
                ? `Your ${item.handbagName} is on the way. Track your delivery in real-time.`
                : `Your ${item.handbagName} is ready for pick up at the selected store.`}
            </Text>
            {deliveryMethod === "deliver" && (
              <TouchableOpacity
                style={s.trackBtn}
                onPress={() => {
                  setShowSuccess(false);
                  navigation.navigate("MainTabs", { screen: "Map" });
                }}
                activeOpacity={0.85}
              >
                <Text style={s.trackBtnText}>Track My Order</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={s.homeBtn}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate("MainTabs", { screen: "Home" });
              }}
            >
              <Text style={s.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
