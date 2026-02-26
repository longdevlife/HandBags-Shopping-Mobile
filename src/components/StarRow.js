import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StarRow({ rating, size = 14 }) {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      stars.push(<Ionicons key={i} name="star" size={size} color="#F5A623" />);
    } else if (i === full + 1 && half) {
      stars.push(
        <Ionicons key={i} name="star-half" size={size} color="#F5A623" />,
      );
    } else {
      stars.push(
        <Ionicons key={i} name="star-outline" size={size} color="#E0E0E0" />,
      );
    }
  }
  return <View style={{ flexDirection: "row", gap: 2 }}>{stars}</View>;
}
