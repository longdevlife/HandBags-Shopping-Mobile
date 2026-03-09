import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Animated,
  StatusBar,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useHandbags } from "../hooks/useHandbags";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import FilterModal from "../components/FilterModal";
import { HomeStyles as s } from "../styles/HomeStyles";

export default function HomeScreen({ navigation }) {
  const {
    filteredData,
    loading,
    refreshing,
    refetch,
    error,
    searchText,
    setSearchText,
    selectedBrand,
    setSelectedBrand,
    BRANDS,
    filters,
    setFilters,
    hasActiveFilters,
  } = useHandbags();

  const { isFavorite, toggleFav } = useFavorites();
  const { addItem, totalItems } = useCart();

  const [filterVisible, setFilterVisible] = useState(false);

  /* ── Scroll animation: collapse header on scroll ── */
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [60, 0],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  /* ── Add to cart with feedback ── */
  const handleAddToCart = useCallback(
    (item) => {
      addItem(item, 1);
    },
    [addItem],
  );

  /* ── Product Card ── */
  const renderProduct = useCallback(
    ({ item }) => (
      <Pressable
        style={s.card}
        onPress={() => navigation.navigate("Detail", { item })}
      >
        <View style={s.imageWrapper}>
          <Image
            source={{ uri: item.uri }}
            style={s.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          {/* Heart icon top-left */}
          <Pressable
            style={s.heartBtn}
            onPress={() => toggleFav(item)}
            hitSlop={6}
          >
            <Ionicons
              name={isFavorite(item.handbagName) ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite(item.handbagName) ? "#FF6B6B" : "#999"}
            />
          </Pressable>
          {/* Discount badge — hide when 0% */}
          {item.percentOff > 0 && (
            <View style={s.discountBadge}>
              <Text style={s.discountText}>
                -{Math.round(item.percentOff * 100)}%
              </Text>
            </View>
          )}
        </View>

        <View style={s.infoContainer}>
          <Text numberOfLines={1} style={s.productName}>
            {item.handbagName}
          </Text>
          <Text numberOfLines={1} style={s.categoryText}>
            {item.category}
          </Text>
          <View style={s.priceRow}>
            <Text style={s.price}>$ {item.cost?.toLocaleString()}</Text>
            <Pressable
              style={s.addBtn}
              onPress={() => handleAddToCart(item)}
              hitSlop={6}
            >
              <Ionicons name="add" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    ),
    [isFavorite, toggleFav, navigation, handleAddToCart],
  );

  /* ── Banner + Brands (inside FlatList header) ── */
  const ListHeader = () => (
    <View>
      {/* Banner with dark bg covering only top half */}
      <View style={s.bannerSection}>
        {/* Dark bg absolute — covers top half only */}
        <View style={s.bannerDarkHalf} />
        {/* Banner card */}
        <View style={s.bannerWrapper}>
          <LinearGradient
            colors={["#4A3728", "#2C1E12"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.banner}
          >
            <View style={s.bannerContent}>
              <View style={s.promoBadge}>
                <Text style={s.promoLabel}>Promo</Text>
              </View>
              <Text style={s.bannerTitle}>Buy one get{"\n"}one FREE</Text>
            </View>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
              }}
              style={s.bannerImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          </LinearGradient>
        </View>
      </View>

      {/* Brand chips on light bg */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={BRANDS}
        keyExtractor={(b) => b}
        contentContainerStyle={s.brandList}
        renderItem={({ item }) => (
          <Pressable
            style={[s.brandChip, selectedBrand === item && s.brandChipActive]}
            onPress={() => setSelectedBrand(item)}
          >
            <Text
              style={[s.brandText, selectedBrand === item && s.brandTextActive]}
            >
              {item}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#D4A574" />
      </View>
    );
  }

  if (error && !loading) {
    return (
      <View style={s.center}>
        <Ionicons name="cloud-offline-outline" size={56} color="#ccc" />
        <Text
          style={{
            color: "#666",
            fontSize: 15,
            marginTop: 12,
            textAlign: "center",
            paddingHorizontal: 32,
          }}
        >
          {error}
        </Text>
        <TouchableOpacity
          onPress={refetch}
          style={{
            marginTop: 16,
            backgroundColor: "#D4A574",
            paddingHorizontal: 28,
            paddingVertical: 10,
            borderRadius: 20,
          }}
          activeOpacity={0.85}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  return (
    <View style={s.container}>
      {/* Dark header area = gradient left→right */}
      <LinearGradient
        colors={["#1B1B1B", "#2D2D2D", "#3A3A3A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[s.darkZone, { paddingTop: statusBarH + 6 }]}
      >
        {/* Animated header text — collapses on scroll */}
        <Animated.View
          style={{
            height: headerHeight,
            opacity: headerOpacity,
            overflow: "hidden",
          }}
        >
          <View style={s.header}>
            <View>
              <Text style={s.headerLabel}>Collection</Text>
              <Text style={s.headerTitle}>Luxury Handbags</Text>
            </View>
            {/* Cart icon with badge */}
            <Pressable
              style={s.cartBtn}
              onPress={() => navigation.navigate("Cart")}
              hitSlop={8}
            >
              <Ionicons name="cart-outline" size={24} color="#fff" />
              {totalItems > 0 && (
                <View style={s.cartBadge}>
                  <Text style={s.cartBadgeText}>
                    {totalItems > 9 ? "9+" : totalItems}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </Animated.View>

        {/* Search bar inside dark zone */}
        <View style={s.searchRow}>
          <View style={s.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={s.input}
              placeholder="Search handbag..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText("")} hitSlop={12}>
                <Ionicons name="close-circle" size={20} color="#ccc" />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[s.filterBtn, hasActiveFilters && s.filterBtnActive]}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="options-outline" size={20} color="#fff" />
            {hasActiveFilters && <View style={s.filterDot} />}
          </Pressable>
        </View>
      </LinearGradient>

      {/* Product grid */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.handbagName}
        renderItem={renderProduct}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={s.listContainer}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor="#D4A574"
            colors={["#D4A574"]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={{ color: "#999", fontSize: 15, marginTop: 12 }}>
                No handbags found
              </Text>
              <Text style={{ color: "#bbb", fontSize: 13, marginTop: 4 }}>
                Try a different search or brand
              </Text>
            </View>
          ) : null
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        current={filters}
      />
    </View>
  );
}
