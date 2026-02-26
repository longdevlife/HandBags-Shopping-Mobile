import React from "react";
import { View, Text } from "react-native";
import { DetailStyles as s } from "../styles/DetailStyles";

export default function InfoRow({ label, value, isLast }) {
  return (
    <View style={[s.infoRow, !isLast && s.infoRowBorder]}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}
