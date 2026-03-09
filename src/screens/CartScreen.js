import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { FavoriteStyles as s } from "../styles/FavoriteStyles";
import SwipeableCard from "../components/SwipeableCard";

export default function CartScreen({ navigation }) {
  const { cart, updateQty, removeItem, clearAll, totalItems, totalPrice } =
    useCart();

  /* ── Multi-select mode (identical to FavoriteScreen) ── */
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const handleLongPress = useCallback(
    (item) => {
      if (!selectMode) {
        setSelectMode(true);
        setSelected(new Set([item.handbagName]));
      }
    },
    [selectMode],
  );

  const toggleSelect = useCallback((item) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item.handbagName)) {
        next.delete(item.handbagName);
      } else {
        next.add(item.handbagName);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selected.size === cart.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(cart.map((c) => c.handbagName)));
    }
  }, [cart, selected.size]);

  const cancelSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelected(new Set());
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    const names = [...selected];
    for (const name of names) {
      await removeItem(name);
    }
    cancelSelectMode();
  }, [selected, removeItem, cancelSelectMode]);

  const handleClearAll = () => {
    Alert.alert("Clear Cart", "Remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          clearAll();
          cancelSelectMode();
        },
      },
    ]);
  };

  /* ── Checkout: navigate to Order screen with first cart item ── */
  const handleCheckout = () => {
    if (cart.length === 0) return;
    // Navigate to the Order screen with the first cart item
    navigation.navigate("Order", { item: cart[0], cartItems: cart });
  };

  const isSelected = (item) => selected.has(item.handbagName);

  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  /* ── Card rendering (exact same layout as FavoriteScreen) ── */
  const renderItem = ({ item }) => (
    <SwipeableCard
      onDelete={() => removeItem(item.handbagName)}
      enabled={!selectMode}
    >
      <TouchableOpacity
        style={[s.card, isSelected(item) && s.cardSelected]}
        activeOpacity={0.85}
        onPress={() =>
          selectMode
            ? toggleSelect(item)
            : navigation.navigate("Detail", { item })
        }
        onLongPress={() => handleLongPress(item)}
        delayLongPress={400}
      >
        <View style={s.imageBox}>
          <Image
            source={{ uri: item.uri }}
            style={s.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          {/* Checkbox overlay on image */}
          {selectMode && (
            <View style={s.checkboxOverlay}>
              <View style={[s.checkbox, isSelected(item) && s.checkboxActive]}>
                {isSelected(item) && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
            </View>
          )}
          {/* Category tag */}
          {!selectMode && (
            <View style={s.categoryTag}>
              <Text style={s.categoryTagText}>{item.category}</Text>
            </View>
          )}
        </View>

        <View style={s.cardBody}>
          <Text style={s.brand}>{item.brand}</Text>
          <Text style={s.name} numberOfLines={1}>
            {item.handbagName}
          </Text>
          <View style={s.cardBottom}>
            <Text style={s.price}>
              ${(item.cost * (item.quantity || 1)).toLocaleString()}
            </Text>
            {item.percentOff > 0 && (
              <View style={s.discountBadge}>
                <Text style={s.discountText}>
                  -{Math.round(item.percentOff * 100)}%
                </Text>
              </View>
            )}
            {/* Qty badge */}
            {(item.quantity || 1) > 1 && (
              <View
                style={{
                  backgroundColor: "#D4A574",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}
                >
                  ×{item.quantity}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </SwipeableCard>
  );

  return (
    <View style={[s.container, { paddingTop: statusBarH }]}>
      {/* Header — exact same as FavoriteScreen */}
      <View style={[s.header, selectMode && s.headerSelect]}>
        {selectMode ? (
          <>
            <View style={s.headerLeft}>
              <Pressable
                onPress={cancelSelectMode}
                hitSlop={10}
                style={s.closeBtn}
              >
                <Ionicons name="close" size={18} color="#fff" />
              </Pressable>
              <Text style={[s.headerTitle, { color: "#fff" }]}>
                {selected.size} selected
              </Text>
            </View>
            <Pressable onPress={selectAll} style={s.selectAllBtn}>
              <Ionicons
                name={
                  selected.size === cart.length ? "checkbox" : "square-outline"
                }
                size={18}
                color="#fff"
              />
              <Text style={s.selectAllText}>
                {selected.size === cart.length ? "Deselect All" : "Select All"}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={s.headerLeft}>
              <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
                <Ionicons name="chevron-back" size={24} color="#1B1B1B" />
              </Pressable>
              <View style={s.headerIcon}>
                <Ionicons name="cart" size={18} color="#fff" />
              </View>
              <Text style={s.headerTitle}>
                My Cart <Text style={s.headerCount}>({totalItems})</Text>
              </Text>
            </View>
            {cart.length > 0 && (
              <Pressable onPress={handleClearAll} style={s.clearBtn}>
                <Ionicons name="trash-bin-outline" size={16} color="#FF6B6B" />
                <Text style={s.clearAll}>Clear All</Text>
              </Pressable>
            )}
          </>
        )}
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.handbagName}
        renderItem={renderItem}
        contentContainerStyle={cart.length === 0 ? s.emptyContainer : s.listPad}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIconCircle}>
              <Ionicons name="cart-outline" size={48} color="#D4A574" />
            </View>
            <Text style={s.emptyTitle}>Your cart is empty</Text>
            <Text style={s.emptySubtitle}>
              Browse our luxury collection and add your favorite handbags
            </Text>
            <TouchableOpacity
              style={s.browseBtn}
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Home" })
              }
              activeOpacity={0.85}
            >
              <Text style={s.browseBtnText}>Browse Handbags</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating bottom action bar in select mode */}
      {selectMode && selected.size > 0 && (
        <View style={s.floatingBar}>
          <Text style={s.floatingText}>
            {selected.size} item{selected.size > 1 ? "s" : ""} selected
          </Text>
          <TouchableOpacity
            style={s.floatingDeleteBtn}
            onPress={handleDeleteSelected}
            activeOpacity={0.85}
          >
            <Ionicons name="trash" size={18} color="#fff" />
            <Text style={s.floatingDeleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom checkout bar (only when NOT in select mode) */}
      {!selectMode && cart.length > 0 && (
        <View style={s.floatingBar}>
          <View>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
              Total ({totalItems} items)
            </Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
              ${" "}
              {totalPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={s.floatingDeleteBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Ionicons name="bag-check" size={18} color="#fff" />
            <Text style={s.floatingDeleteText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
