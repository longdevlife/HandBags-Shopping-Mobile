import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import useUserLocation, { FALLBACK } from "../hooks/useUserLocation";

const { width } = Dimensions.get("window");

const DELTA = { latitudeDelta: 0.015, longitudeDelta: 0.015 };

/* Reverse geocode with OpenStreetMap Nominatim (free, no key) */
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { "User-Agent": "HandBagsApp/1.0" } },
    );
    const data = await res.json();
    if (!data || data.error) return null;
    const a = data.address || {};
    const name =
      a.road ||
      a.pedestrian ||
      a.neighbourhood ||
      a.suburb ||
      data.display_name?.split(",")[0] ||
      "Selected Location";
    const detail = [a.house_number, a.road, a.suburb, a.city || a.town]
      .filter(Boolean)
      .join(", ");
    return {
      name,
      detail: detail || data.display_name?.substring(0, 60) || "",
    };
  } catch {
    return null;
  }
}

export default function AddressPickerScreen({ route, navigation }) {
  const current = route.params?.currentAddress;
  const { location: userLoc, loading: locLoading, refresh: refreshLoc } = useUserLocation();

  /* Initial region: use current address if editing, else real GPS */
  const initialLat = current?.latitude || userLoc.latitude;
  const initialLng = current?.longitude || userLoc.longitude;

  const [pin, setPin] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });
  const [address, setAddress] = useState({
    name: current?.name || "",
    detail: current?.detail || "",
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const mapRef = useRef(null);

  /* Move pin to real GPS once it loads (only if no current address) */
  const didCenter = useRef(!!current);
  useEffect(() => {
    if (!didCenter.current && !locLoading) {
      didCenter.current = true;
      const loc = { latitude: userLoc.latitude, longitude: userLoc.longitude };
      setPin(loc);
      mapRef.current?.animateToRegion({ ...loc, ...DELTA }, 600);
    }
  }, [userLoc, locLoading]);

  /* Debounced reverse geocode on pin change (800ms) */
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      const result = await reverseGeocode(pin.latitude, pin.longitude);
      if (!cancelled && result) setAddress(result);
      if (!cancelled) setLoading(false);
    }, 800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pin.latitude, pin.longitude]);

  /* "Use Current Location" — move pin to real GPS */
  const goToMyLocation = useCallback(async () => {
    await refreshLoc();
    const loc = { latitude: userLoc.latitude, longitude: userLoc.longitude };
    setPin(loc);
    mapRef.current?.animateToRegion({ ...loc, ...DELTA }, 600);
  }, [userLoc, refreshLoc]);

  /* Search location with Nominatim */
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchText,
        )}&format=json&limit=1`,
        { headers: { "User-Agent": "HandBagsApp/1.0" } },
      );
      const data = await res.json();
      if (data.length > 0) {
        const loc = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        setPin(loc);
        mapRef.current?.animateToRegion(
          { ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 },
          600,
        );
      }
    } catch {
      /* silent */
    }
    setLoading(false);
  };

  const confirmAddress = () => {
    navigation.navigate("Order", {
      ...route.params,
      selectedAddress: {
        ...address,
        latitude: pin.latitude,
        longitude: pin.longitude,
      },
    });
  };

  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  return (
    <View style={st.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={st.map}
        initialRegion={{ latitude: initialLat, longitude: initialLng, ...DELTA }}
        onPress={(e) => setPin(e.nativeEvent.coordinate)}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={pin}
          draggable
          onDragEnd={(e) => setPin(e.nativeEvent.coordinate)}
        >
          <View style={st.pinWrap}>
            <View style={st.pinHead}>
              <Ionicons name="location" size={18} color="#fff" />
            </View>
            <View style={st.pinTail} />
          </View>
        </Marker>
      </MapView>

      {/* Top bar: back + search */}
      <View style={[st.topBar, { top: statusBarH + 10 }]}>
        <Pressable style={st.backCircle} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#1B1B1B" />
        </Pressable>
        <View style={st.searchBox}>
          <Ionicons name="search" size={16} color="#999" />
          <TextInput
            style={st.searchInput}
            placeholder="Search address…"
            placeholderTextColor="#BBB"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={16} color="#CCC" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Use Current Location button */}
      <TouchableOpacity
        style={st.useLocBtn}
        activeOpacity={0.8}
        onPress={goToMyLocation}
      >
        <Ionicons name="navigate" size={16} color="#fff" />
        <Text style={st.useLocText}>Use Current Location</Text>
      </TouchableOpacity>

      {/* Recenter button — go to user's real GPS */}
      <TouchableOpacity
        style={st.myLocBtn}
        activeOpacity={0.8}
        onPress={goToMyLocation}
      >
        <Ionicons name="locate" size={20} color="#D4A574" />
      </TouchableOpacity>

      {/* Bottom card */}
      <View style={st.bottomCard}>
        <View style={st.handle} />
        <View style={st.addressRow}>
          <View style={st.locIcon}>
            <Ionicons name="location" size={18} color="#D4A574" />
          </View>
          <View style={{ flex: 1 }}>
            {loading ? (
              <ActivityIndicator size="small" color="#D4A574" />
            ) : (
              <>
                <Text style={st.addrName} numberOfLines={1}>
                  {address.name || "Move pin to select"}
                </Text>
                <Text style={st.addrDetail} numberOfLines={2}>
                  {address.detail || "Tap on map or drag the pin"}
                </Text>
              </>
            )}
          </View>
        </View>
        <Text style={st.hint}>
          Tap on map or drag pin to set delivery location
        </Text>
        <TouchableOpacity
          style={[st.confirmBtn, !address.name && { opacity: 0.5 }]}
          onPress={confirmAddress}
          activeOpacity={0.85}
          disabled={!address.name}
        >
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={st.confirmBtnText}>Confirm Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  /* Top bar */
  topBar: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1B1B1B",
    paddingVertical: 0,
  },

  /* My location */
  myLocBtn: {
    position: "absolute",
    right: 16,
    bottom: 220,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  useLocBtn: {
    position: "absolute",
    left: 16,
    bottom: 220,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#D4A574",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  useLocText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  /* Pin */
  pinWrap: { alignItems: "center" },
  pinHead: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#D4A574",
    marginTop: -2,
  },

  /* Bottom card */
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 14,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  locIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(212,165,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  addrName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  addrDetail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
    lineHeight: 16,
  },
  hint: {
    fontSize: 11,
    color: "#BBB",
    textAlign: "center",
    marginBottom: 12,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D4A574",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});
