import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FavoriteStyles as s } from "../styles/FavoriteStyles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = -100;
const DELETE_THRESHOLD = -200;

export default function SwipeableCard({ children, onDelete, enabled }) {
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

      <Animated.View
        style={{ transform: [{ translateX }], backgroundColor: "#F5F5F5" }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}
