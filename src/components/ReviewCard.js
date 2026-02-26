import React from "react";
import { View, Text } from "react-native";
import StarRow from "./StarRow";
import { DetailStyles as s } from "../styles/DetailStyles";

export default function ReviewCard({ review }) {
  return (
    <View style={s.reviewCard}>
      <View style={s.reviewHeader}>
        <View style={s.reviewAvatar}>
          <Text style={s.reviewAvatarText}>{review.avatar}</Text>
        </View>
        <View style={s.reviewMeta}>
          <Text style={s.reviewName}>{review.reviewer}</Text>
          <Text style={s.reviewDate}>{review.date}</Text>
        </View>
        <StarRow rating={review.rating} size={12} />
      </View>
      <Text style={s.reviewComment}>{review.comment}</Text>
    </View>
  );
}
