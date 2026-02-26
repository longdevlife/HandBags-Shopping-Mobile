import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDetail } from "../hooks/useDetail";
import { DetailStyles as s } from "../styles/DetailStyles";
import { getProductReviews } from "../utils/mockReviews";

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params;
  const {
    fav,
    handleToggle,
    discountPercent,
    originalPrice,
    genderColor,
    genderIcon,
    genderLabel,
    colorText,
  } = useDetail(item);

  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviewData = useMemo(
    () => getProductReviews(item.handbagName),
    [item.handbagName],
  );
  const { reviews, averageRating, totalReviews, ratingBreakdown } = reviewData;
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const description =
    item.description ||
    `A luxurious ${item.brand} ${item.category} handbag crafted with premium materials. The ${item.handbagName} features exquisite craftsmanship and timeless design, perfect for the modern fashion-forward individual. Available in ${colorText}.`;

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
        {/* ── Product Image ── */}
        <View style={s.imageWrapper}>
          <Image
            source={{ uri: item.uri }}
            style={s.image}
            resizeMode="cover"
          />
        </View>

        <View style={s.body}>
          {/* ── Name + subtitle ── */}
          <Text style={s.name}>{item.handbagName}</Text>
          <View style={s.subtitleRow}>
            <Text style={s.subtitle}>
              {item.category} · {item.brand}
            </Text>
            <View style={s.iconGroup}>
              <View style={[s.genderDot, { backgroundColor: genderColor }]}>
                <Ionicons name={genderIcon} size={14} color="#fff" />
              </View>
            </View>
          </View>

          {/* ── Divider ── */}
          <View style={s.divider} />

          {/* ── Description ── */}
          <Text style={s.sectionTitle}>Description</Text>
          <Text style={s.descText} numberOfLines={showFullDesc ? undefined : 3}>
            {description}
          </Text>
          <Pressable onPress={() => setShowFullDesc(!showFullDesc)}>
            <Text style={s.readMore}>
              {showFullDesc ? "Show Less" : "Read More"}
            </Text>
          </Pressable>

          {/* ── Product Info ── */}
          <Text style={[s.sectionTitle, { marginTop: 20 }]}>
            Product Information
          </Text>
          <View style={s.infoCard}>
            <InfoRow label="Category" value={item.category} />
            <InfoRow label="Colors" value={colorText} />
            <InfoRow label="Brand" value={item.brand} />
            <InfoRow label="Gender" value={genderLabel} isLast />
          </View>

          {/* ── Color chips ── */}
          {item.color && item.color.length > 0 && (
            <View>
              <Text style={[s.sectionTitle, { marginTop: 20 }]}>
                Available Colors
              </Text>
              <View style={s.colorRow}>
                {item.color.map((c, i) => (
                  <View
                    key={i}
                    style={[s.colorChip, i === 0 && s.colorChipActive]}
                  >
                    <Text
                      style={[
                        s.colorChipText,
                        i === 0 && s.colorChipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Ratings & Reviews ── */}
          <View style={s.divider} />
          <Text style={s.sectionTitle}>Ratings & Reviews</Text>

          {/* Rating Summary */}
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

          {/* Review List */}
          <View style={s.reviewList}>
            {displayedReviews.map((review) => (
              <View key={review.id} style={s.reviewCard}>
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
            ))}
          </View>

          {reviews.length > 3 && (
            <TouchableOpacity
              onPress={() => setShowAllReviews(!showAllReviews)}
              style={s.showAllBtn}
              activeOpacity={0.8}
            >
              <Text style={s.showAllText}>
                {showAllReviews
                  ? "Show Less"
                  : `See All ${totalReviews} Reviews`}
              </Text>
              <Ionicons
                name={showAllReviews ? "chevron-up" : "chevron-down"}
                size={16}
                color="#D4A574"
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={s.bottomBar}>
        <View>
          <Text style={s.bottomLabel}>Price</Text>
          <Text style={s.bottomPrice}>$ {item.cost.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={s.actionBtn} activeOpacity={0.85}>
          <Text style={s.actionBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoRow({ label, value, isLast }) {
  return (
    <View style={[s.infoRow, !isLast && s.infoRowBorder]}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

function StarRow({ rating, size = 14 }) {
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
