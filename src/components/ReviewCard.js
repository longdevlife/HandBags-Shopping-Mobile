import React from "react";
import { View, Text, Image } from "react-native";
import StarRow from "./StarRow";
import { DetailStyles as s } from "../styles/DetailStyles";

export default function ReviewCard({ review }) {
  return (
    <View style={s.reviewCard}>
      <View style={s.reviewHeader}>
        <View
          style={[
            s.reviewAvatar,
            review.isUser && { backgroundColor: "#4D96FF" },
          ]}
        >
          <Text style={s.reviewAvatarText}>{review.avatar}</Text>
        </View>
        <View style={s.reviewMeta}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={s.reviewName}>{review.reviewer}</Text>
            {review.isUser && (
              <View style={s.userBadge}>
                <Text style={s.userBadgeText}>You</Text>
              </View>
            )}
          </View>
          <Text style={s.reviewDate}>{review.date}</Text>
        </View>
        <StarRow rating={review.rating} size={12} />
      </View>
      <Text style={s.reviewComment}>{review.comment}</Text>
      {review.photoUri && (
        <Image
          source={{ uri: review.photoUri }}
          style={s.reviewPhoto}
          resizeMode="cover"
        />
      )}
    </View>
  );
}
