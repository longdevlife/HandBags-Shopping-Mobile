import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = [
  "All",
  "Crossbody",
  "Shoulder Bag",
  "Card Case",
  "Card Holder",
  "Wallets",
  "Tote Bags",
];

const SORT_OPTIONS = [
  { key: "price_desc", label: "Price: High → Low", icon: "trending-down" },
  { key: "price_asc", label: "Price: Low → High", icon: "trending-up" },
  { key: "discount", label: "Biggest Discount", icon: "pricetag" },
  { key: "name_asc", label: "Name: A → Z", icon: "text" },
];

export default function FilterModal({ visible, onClose, onApply, current }) {
  const [category, setCategory] = useState(current?.category || "All");
  const [sortBy, setSortBy] = useState(current?.sortBy || "price_desc");
  const [gender, setGender] = useState(current?.gender ?? "all"); // "all" | "true" | "false"

  const handleReset = () => {
    setCategory("All");
    setSortBy("price_desc");
    setGender("all");
  };

  const handleApply = () => {
    onApply({ category, sortBy, gender });
    onClose();
  };

  const hasChanges =
    category !== "All" || sortBy !== "price_desc" || gender !== "all";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter & Sort</Text>
            {hasChanges && (
              <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 420 }}
          >
            {/* ── Sort By ── */}
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.sortList}>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.sortItem,
                    sortBy === opt.key && styles.sortItemActive,
                  ]}
                  onPress={() => setSortBy(opt.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={opt.icon}
                    size={16}
                    color={sortBy === opt.key ? "#D4A574" : "#999"}
                  />
                  <Text
                    style={[
                      styles.sortText,
                      sortBy === opt.key && styles.sortTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {sortBy === opt.key && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#D4A574"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Category ── */}
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, category === cat && styles.chipActive]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      category === cat && styles.chipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Gender ── */}
            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.chipRow}>
              {[
                { key: "all", label: "All", icon: "people" },
                { key: "true", label: "Women", icon: "woman" },
                { key: "false", label: "Men", icon: "man" },
              ].map((g) => (
                <TouchableOpacity
                  key={g.key}
                  style={[
                    styles.genderChip,
                    gender === g.key && styles.genderChipActive,
                  ]}
                  onPress={() => setGender(g.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={g.icon}
                    size={14}
                    color={gender === g.key ? "#fff" : "#666"}
                  />
                  <Text
                    style={[
                      styles.genderText,
                      gender === g.key && styles.genderTextActive,
                    ]}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Apply Button */}
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            activeOpacity={0.85}
          >
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: "75%",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#1B1B1B" },
  resetText: { fontSize: 14, fontWeight: "600", color: "#FF6B6B" },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
    marginTop: 18,
    marginBottom: 10,
  },

  /* Sort */
  sortList: { gap: 6 },
  sortItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    gap: 10,
  },
  sortItemActive: {
    backgroundColor: "rgba(212,165,116,0.08)",
    borderWidth: 1,
    borderColor: "rgba(212,165,116,0.3)",
  },
  sortText: { flex: 1, fontSize: 14, color: "#666" },
  sortTextActive: { color: "#1B1B1B", fontWeight: "600" },

  /* Chips */
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  chipActive: {
    backgroundColor: "#D4A574",
    borderColor: "#D4A574",
  },
  chipText: { fontSize: 13, fontWeight: "600", color: "#666" },
  chipTextActive: { color: "#fff" },

  /* Gender */
  genderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  genderChipActive: {
    backgroundColor: "#D4A574",
    borderColor: "#D4A574",
  },
  genderText: { fontSize: 13, fontWeight: "600", color: "#666" },
  genderTextActive: { color: "#fff" },

  /* Apply */
  applyBtn: {
    backgroundColor: "#D4A574",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  applyText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
