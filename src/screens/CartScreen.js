import React from "react";
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
import { CartStyles as s } from "../styles/CartStyles";

export default function CartScreen({ navigation }) {
  const { cart, updateQty, removeItem, clearAll, totalItems, totalPrice } =
    useCart();

  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  const handleClearAll = () => {
    Alert.alert("Clear Cart", "Remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearAll },
    ]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    // Navigate to Order screen with full cart
    navigation.navigate("CartOrder", { cartItems: cart });
  };

  const renderItem = ({ item }) => (
    <View style={s.card}>
      <Image
        source={{ uri: item.uri }}
        style={s.itemImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={s.itemBody}>
        <View>
          <Text style={s.itemBrand}>{item.brand}</Text>
          <Text style={s.itemName} numberOfLines={1}>
            {item.handbagName}
          </Text>
          <Text style={s.itemCategory}>{item.category}</Text>
        </View>
        <View style={s.priceQtyRow}>
          <Text style={s.itemPrice}>
            $ {(item.cost * item.quantity).toLocaleString()}
          </Text>
          <View style={s.qtyControl}>
            <Pressable
              style={[s.qtyBtn, s.qtyBtnActive]}
              onPress={() => {
                if (item.quantity <= 1) {
                  Alert.alert("Remove Item", `Remove ${item.handbagName}?`, [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Remove",
                      style: "destructive",
                      onPress: () => removeItem(item.handbagName),
                    },
                  ]);
                } else {
                  updateQty(item.handbagName, item.quantity - 1);
                }
              }}
            >
              <Ionicons
                name={item.quantity <= 1 ? "trash-outline" : "remove"}
                size={14}
                color={item.quantity <= 1 ? "#FF6B6B" : "#1B1B1B"}
              />
            </Pressable>
            <Text style={s.qtyText}>{item.quantity}</Text>
            <Pressable
              style={[s.qtyBtn, s.qtyBtnActive]}
              onPress={() => updateQty(item.handbagName, item.quantity + 1)}
            >
              <Ionicons name="add" size={14} color="#1B1B1B" />
            </Pressable>
          </View>
        </View>
      </View>
      {/* Delete button */}
      <Pressable
        style={s.deleteBtn}
        onPress={() => removeItem(item.handbagName)}
        hitSlop={8}
      >
        <Ionicons name="close" size={16} color="#CCC" />
      </Pressable>
    </View>
  );

  return (
    <View style={[s.container, { paddingTop: statusBarH }]}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
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
            <Text style={s.clearText}>Clear</Text>
          </Pressable>
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
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.85}
            >
              <Text style={s.browseBtnText}>Browse Handbags</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Bottom checkout bar */}
      {cart.length > 0 && (
        <View style={s.bottomBar}>
          <View style={s.totalInfo}>
            <Text style={s.totalInfoLabel}>Total</Text>
            <Text style={s.totalInfoPrice}>
              ${" "}
              {totalPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={s.checkoutBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Ionicons name="bag-check" size={18} color="#fff" />
            <Text style={s.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
