import React, { useState } from "react";
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
        </View>
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={s.bottomBar}>
        <View>
          <Text style={s.bottomLabel}>Price</Text>
          <Text style={s.bottomPrice}>$ {item.cost.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={s.actionBtn}
          activeOpacity={0.85}
        >
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
