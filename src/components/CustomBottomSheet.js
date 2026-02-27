import React, { useRef, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";

const { height: SCREEN_H } = Dimensions.get("window");

/**
 * A lightweight BottomSheet built with React Native's Animated API.
 * No native modules required — works perfectly in Expo Go.
 *
 * Props:
 *  - snapPoints : string[]   e.g. ["28%","62%"]
 *  - index      : number     initial snap index (default 0)
 *  - children   : ReactNode
 *  - bgStyle    : object     style for the sheet background
 *  - handleStyle: object     style for the drag handle indicator
 */
const CustomBottomSheet = React.forwardRef(
  ({ snapPoints = ["30%", "70%"], index = 0, children, bgStyle, handleStyle }, ref) => {
    /* Convert "28%" → pixel height from top */
    const snapPixels = useMemo(
      () =>
        snapPoints.map((sp) => {
          const pct = parseFloat(sp) / 100;
          return SCREEN_H * (1 - pct); // top offset
        }),
      [snapPoints],
    );

    const translateY = useRef(new Animated.Value(snapPixels[index] ?? snapPixels[0])).current;
    const currentSnap = useRef(index);

    /* Expose snapToIndex via ref */
    React.useImperativeHandle(ref, () => ({
      snapToIndex: (i) => {
        const target = snapPixels[Math.min(i, snapPixels.length - 1)];
        currentSnap.current = i;
        Animated.spring(translateY, {
          toValue: target,
          useNativeDriver: false,
          damping: 20,
          stiffness: 150,
        }).start();
      },
    }));

    /* Find nearest snap point */
    const snapTo = useCallback(
      (y) => {
        let nearest = 0;
        let minDist = Infinity;
        snapPixels.forEach((sp, i) => {
          const d = Math.abs(y - sp);
          if (d < minDist) {
            minDist = d;
            nearest = i;
          }
        });
        currentSnap.current = nearest;
        Animated.spring(translateY, {
          toValue: snapPixels[nearest],
          useNativeDriver: false,
          damping: 20,
          stiffness: 150,
        }).start();
      },
      [snapPixels, translateY],
    );

    /* PanResponder for drag gesture */
    const panResponder = useMemo(() => {
      let startY = 0;
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
        onPanResponderGrant: () => {
          translateY.stopAnimation((v) => {
            startY = v;
          });
        },
        onPanResponderMove: (_, g) => {
          const newY = startY + g.dy;
          /* Clamp between min and max snap points */
          const minY = Math.min(...snapPixels);
          const maxY = Math.max(...snapPixels);
          translateY.setValue(Math.max(minY - 30, Math.min(maxY + 30, newY)));
        },
        onPanResponderRelease: (_, g) => {
          snapTo(startY + g.dy);
        },
      });
    }, [snapPixels, translateY, snapTo]);

    return (
      <Animated.View
        style={[
          styles.sheet,
          bgStyle,
          { transform: [{ translateY }] },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handleZone} {...panResponder.panHandlers}>
          <View style={[styles.handle, handleStyle]} />
        </View>
        {/* Content */}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: SCREEN_H,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  handleZone: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
  },
  content: {
    flex: 1,
  },
});

export default CustomBottomSheet;
