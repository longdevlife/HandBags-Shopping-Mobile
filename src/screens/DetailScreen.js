import React, { useState, useMemo, useRef } from "react";
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
import { useUserReviews } from "../hooks/useUserReviews";
import StarRow from "../components/StarRow";
import InfoRow from "../components/InfoRow";
import RatingSummary from "../components/RatingSummary";
import ReviewCard from "../components/ReviewCard";
import WriteReview from "../components/WriteReview";

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
  const [showWriteReview, setShowWriteReview] = useState(false);

  const { userReviews, submitReview } = useUserReviews(item.handbagName);

  const reviewData = useMemo(
    () => getProductReviews(item.handbagName),
    [item.handbagName],
  );
  const { reviews: mockReviews, averageRating, totalReviews, ratingBreakdown } = reviewData;

  /* Merge user reviews on top of mock reviews */
  const allReviews = useMemo(
    () => [...userReviews, ...mockReviews],
    [userReviews, mockReviews],
  );
  const displayedReviews = showAllReviews ? allReviews : allReviews.slice(0, 3);

  const scrollRef = useRef(null);
  const reviewsY = useRef(0);

  const scrollToReviews = () => {
    scrollRef.current?.scrollTo({ y: reviewsY.current, animated: true });
  };

  const description =
    item.description ||
    `A luxurious ${item.brand} ${item.category} handbag crafted with premium materials. The ${item.handbagName} features exquisite craftsmanship and timeless design, perfect for the modern fashion-forward individual. Available in ${colorText}.`;

  return (
    <View style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={s.scroll}
        ref={scrollRef}
      >
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
              <Pressable onPress={scrollToReviews} style={s.ratingBadge}>
                <Ionicons name="star" size={12} color="#F5A623" />
                <Text style={s.ratingBadgeText}>{averageRating}</Text>
                <Text style={s.ratingBadgeCount}>({totalReviews})</Text>
              </Pressable>
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
          <View
            style={s.divider}
            onLayout={(e) => {
              reviewsY.current = e.nativeEvent.layout.y;
            }}
          />
          <View style={s.reviewHeaderRow}>
            <Text style={s.sectionTitle}>Ratings & Reviews</Text>
            {!showWriteReview && (
              <TouchableOpacity
                style={s.writeReviewBtn}
                onPress={() => setShowWriteReview(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={14} color="#D4A574" />
                <Text style={s.writeReviewBtnText}>Write</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Write Review Form */}
          {showWriteReview && (
            <WriteReview
              onSubmit={async (review) => {
                await submitReview(review);
                setShowWriteReview(false);
              }}
              onCancel={() => setShowWriteReview(false)}
            />
          )}

          {/* Rating Summary */}
          <RatingSummary
            averageRating={averageRating}
            totalReviews={totalReviews + userReviews.length}
            ratingBreakdown={ratingBreakdown}
          />

          {/* Review List */}
          <View style={s.reviewList}>
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>

          {allReviews.length > 3 && (
            <TouchableOpacity
              onPress={() => setShowAllReviews(!showAllReviews)}
              style={s.showAllBtn}
              activeOpacity={0.8}
            >
              <Text style={s.showAllText}>
                {showAllReviews
                  ? "Show Less"
                  : `See All ${allReviews.length} Reviews`}
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
          <Text style={s.bottomPrice}>$ {item.cost?.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={s.actionBtn} activeOpacity={0.85}>
          <Text style={s.actionBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
