import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FavoriteStyles as s } from "../styles/FavoriteStyles";
import { useFavoriteList } from "../hooks/useFavoriteList";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = -100; // px to reveal delete button
const DELETE_THRESHOLD = -200; // px to auto-delete

/* ── Swipeable Card Wrapper ── */
function SwipeableCard({ children, onDelete, enabled }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  const resetPosition = useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 9,
    }).start();
    isOpen.current = false;
  }, [translateX]);

  const snapOpen = useCallback(() => {
    Animated.spring(translateX, {
      toValue: SWIPE_THRESHOLD,
      useNativeDriver: true,
      tension: 60,
      friction: 9,
    }).start();
    isOpen.current = true;
  }, [translateX]);

  const animateDelete = useCallback(() => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onDelete());
  }, [translateX, onDelete]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        enabled && Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => {
        translateX.setOffset(translateX._value);
        translateX.setValue(0);
      },
      onPanResponderMove: (_, g) => {
        const val = g.dx;
        // Only allow swipe left (negative) from current offset
        if (translateX._offset + val <= 0) {
          translateX.setValue(val);
        }
      },
      onPanResponderRelease: (_, g) => {
        translateX.flattenOffset();
        const current = translateX._value;
        if (current < DELETE_THRESHOLD) {
          animateDelete();
        } else if (current < SWIPE_THRESHOLD / 2) {
          snapOpen();
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  if (!enabled) {
    return <View>{children}</View>;
  }

  return (
    <View style={s.swipeContainer}>
      {/* Delete action behind the card */}
      <View style={s.swipeDeleteBg}>
        <TouchableOpacity
          style={s.swipeDeleteBtn}
          onPress={animateDelete}
          activeOpacity={0.85}
        >
          <Ionicons name="trash" size={22} color="#fff" />
          <Text style={s.swipeDeleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Foreground card */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

export default function FavoriteScreen({ navigation }) {
  const {
    favorites,
    handleDeleteOne,
    handleClearAll,
    selectMode,
    selected,
    handleLongPress,
    toggleSelect,
    selectAll,
    cancelSelectMode,
    handleDeleteSelected,
  } = useFavoriteList();
  const statusBarH =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

  const isSelected = (item) => selected.has(item.handbagName);

  const renderItem = ({ item }) => (
    <SwipeableCard onDelete={() => handleDeleteOne(item)} enabled={!selectMode}>
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
            resizeMode="cover"
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
            <Text style={s.price}>${item.cost?.toLocaleString()}</Text>
            {item.percentOff > 0 && (
              <View style={s.discountBadge}>
                <Text style={s.discountText}>
                  -{Math.round(item.percentOff * 100)}%
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
      {/* Header */}
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
                  selected.size === favorites.length
                    ? "checkbox"
                    : "square-outline"
                }
                size={18}
                color="#fff"
              />
              <Text style={s.selectAllText}>
                {selected.size === favorites.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={s.headerLeft}>
              <View style={s.headerIcon}>
                <Ionicons name="heart" size={18} color="#fff" />
              </View>
              <Text style={s.headerTitle}>
                My Favorites{" "}
                <Text style={s.headerCount}>({favorites.length})</Text>
              </Text>
            </View>
            {favorites.length > 0 && (
              <Pressable onPress={handleClearAll} style={s.clearBtn}>
                <Ionicons name="trash-bin-outline" size={16} color="#FF6B6B" />
                <Text style={s.clearAll}>Clear All</Text>
              </Pressable>
            )}
          </>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.handbagName}
        renderItem={renderItem}
        contentContainerStyle={
          favorites.length === 0 ? s.emptyContainer : s.listPad
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIconCircle}>
              <Ionicons name="heart-outline" size={48} color="#D4A574" />
            </View>
            <Text style={s.emptyTitle}>No favorites yet</Text>
            <Text style={s.emptySubtitle}>
              Tap the heart icon on any handbag to save it here
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
    </View>
  );
}
