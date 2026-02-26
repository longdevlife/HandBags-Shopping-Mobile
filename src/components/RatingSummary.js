import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StarRow from "./StarRow";
import { DetailStyles as s } from "../styles/DetailStyles";

export default function RatingSummary({
  averageRating,
  totalReviews,
  ratingBreakdown,
}) {
  return (
    <View style={s.ratingSummary}>
      <View style={s.ratingLeft}>
        <Text style={s.ratingBig}>{averageRating}</Text>
        <StarRow rating={averageRating} size={16} />
        <Text style={s.ratingCount}>{totalReviews} reviews</Text>
      </View>
      <View style={s.ratingRight}>
        {[5, 4, 3, 2, 1].map((star) => (
          <View key={star} style={s.breakdownRow}>
            <Text style={s.breakdownLabel}>{star}</Text>
            <Ionicons name="star" size={10} color="#F5A623" />
            <View style={s.breakdownBarBg}>
              <View
                style={[
                  s.breakdownBarFill,
                  {
                    width:
                      totalReviews > 0
                        ? `${(ratingBreakdown[star] / totalReviews) * 100}%`
                        : "0%",
                  },
                ]}
              />
            </View>
            <Text style={s.breakdownCount}>{ratingBreakdown[star]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
