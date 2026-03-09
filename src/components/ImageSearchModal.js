import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { analyzeHandbagImage } from "../api/geminiVisionApi";

export default function ImageSearchModal({
  visible,
  onClose,
  products = [],
  navigation,
}) {
  const [imageUri, setImageUri] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  /* ── Pick image ── */
  const pickImage = async (useCamera) => {
    let res;
    if (useCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission needed", "Camera access is required.");
        return;
      }
      res = await ImagePicker.launchCameraAsync({
        quality: 0.6,
        base64: true,
      });
    } else {
      res = await ImagePicker.launchImageLibraryAsync({
        quality: 0.6,
        base64: true,
        mediaTypes: "images",
      });
    }

    if (!res.canceled && res.assets?.[0]) {
      const asset = res.assets[0];
      setImageUri(asset.uri);
      setResult(null);
      setShowResults(false);
      analyzeImage(asset.base64, asset.mimeType || "image/jpeg");
    }
  };

  const analyzeImage = async (base64, mimeType) => {
    setAnalyzing(true);
    try {
      const data = await analyzeHandbagImage(base64, mimeType);
      setResult(data);
    } catch (e) {
      Alert.alert("Error", "Failed to analyze image. Please try again.");
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Find matching products from catalog ── */
  const matchingProducts = useMemo(() => {
    if (!result || !products.length) return [];

    const keywords = (result.keywords || []).map((k) => k.toLowerCase());
    const brand = (result.suggestedBrand || "").toLowerCase();
    const category = (result.suggestedCategory || "").toLowerCase();
    const color = (result.suggestedColor || "").toLowerCase();

    /* Score each product */
    const scored = products.map((p) => {
      let score = 0;
      const pName = (p.handbagName || "").toLowerCase();
      const pBrand = (p.brand || "").toLowerCase();
      const pCat = (p.category || "").toLowerCase();
      const pColors = (p.color || []).map((c) =>
        typeof c === "string" ? c.toLowerCase() : "",
      );

      /* Brand match = strongest signal */
      if (brand && brand !== "unknown" && pBrand.includes(brand)) score += 5;

      /* Category match */
      if (category && category !== "unknown" && pCat.includes(category))
        score += 4;

      /* Color match */
      if (color && color !== "unknown") {
        if (pColors.some((c) => c.includes(color) || color.includes(c)))
          score += 3;
      }

      /* Keyword matches */
      keywords.forEach((kw) => {
        if (pName.includes(kw) || pCat.includes(kw) || pBrand.includes(kw))
          score += 2;
        if (pColors.some((c) => c.includes(kw))) score += 1;
      });

      return { ...p, score };
    });

    return scored
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [result, products]);

  const handleFindSimilar = () => {
    setShowResults(true);
  };

  const handleProductPress = (product) => {
    handleClose();
    navigation?.navigate("Detail", { item: product });
  };

  const handleClose = () => {
    setImageUri(null);
    setResult(null);
    setAnalyzing(false);
    setShowResults(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={st.overlay} onPress={handleClose}>
        <Pressable style={st.sheet} onPress={() => {}}>
          <View style={st.handleBar} />

          <View style={st.header}>
            <Text style={st.title}>
              {showResults ? "Similar Products" : "Search by Image"}
            </Text>
            <Pressable onPress={handleClose} hitSlop={10}>
              <Ionicons name="close" size={22} color="#999" />
            </Pressable>
          </View>

          {/* Back button when showing results */}
          {showResults && (
            <Pressable style={st.backRow} onPress={() => setShowResults(false)}>
              <Ionicons name="chevron-back" size={18} color="#D4A574" />
              <Text style={st.backText}>Back to analysis</Text>
            </Pressable>
          )}

          {/* ── Results View ── */}
          {showResults ? (
            <FlatList
              data={matchingProducts}
              keyExtractor={(item) => item.handbagName}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View style={st.emptyResult}>
                  <Ionicons name="search-outline" size={40} color="#ccc" />
                  <Text style={st.emptyTitle}>No matching products</Text>
                  <Text style={st.emptySubtitle}>
                    Try a different image for better results
                  </Text>
                </View>
              }
              ListHeaderComponent={
                imageUri ? (
                  <View style={st.miniPreview}>
                    <Image
                      source={{ uri: imageUri }}
                      style={st.miniImage}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={st.miniLabel}>
                        {matchingProducts.length} products found
                      </Text>
                      <Text style={st.miniDesc} numberOfLines={1}>
                        {result?.description}
                      </Text>
                    </View>
                  </View>
                ) : null
              }
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={st.productCard}
                  onPress={() => handleProductPress(item)}
                  activeOpacity={0.85}
                >
                  <View style={st.matchBadge}>
                    <Text style={st.matchText}>#{index + 1}</Text>
                  </View>
                  <Image
                    source={{ uri: item.uri }}
                    style={st.productImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                  <View style={st.productInfo}>
                    <Text style={st.productBrand}>{item.brand}</Text>
                    <Text style={st.productName} numberOfLines={1}>
                      {item.handbagName}
                    </Text>
                    <Text style={st.productCategory}>{item.category}</Text>
                    <Text style={st.productPrice}>
                      ${item.cost?.toLocaleString()}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
              )}
            />
          ) : (
            /* ── Analysis View ── */
            <ScrollView showsVerticalScrollIndicator={false}>
              {!imageUri && (
                <>
                  <Text style={st.subtitle}>
                    Take a photo or upload an image of a handbag to find similar
                    products in our collection
                  </Text>
                  <View style={st.sources}>
                    <TouchableOpacity
                      style={st.sourceBtn}
                      onPress={() => pickImage(true)}
                      activeOpacity={0.85}
                    >
                      <View style={st.sourceIconCircle}>
                        <Ionicons name="camera" size={28} color="#D4A574" />
                      </View>
                      <Text style={st.sourceLabel}>Camera</Text>
                      <Text style={st.sourceDesc}>Take a photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={st.sourceBtn}
                      onPress={() => pickImage(false)}
                      activeOpacity={0.85}
                    >
                      <View style={st.sourceIconCircle}>
                        <Ionicons name="images" size={28} color="#D4A574" />
                      </View>
                      <Text style={st.sourceLabel}>Gallery</Text>
                      <Text style={st.sourceDesc}>Choose photo</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {imageUri && (
                <>
                  <View style={st.previewWrap}>
                    <Image
                      source={{ uri: imageUri }}
                      style={st.previewImage}
                      contentFit="cover"
                    />
                    <Pressable
                      style={st.retakeBtn}
                      onPress={() => {
                        setImageUri(null);
                        setResult(null);
                      }}
                    >
                      <Ionicons name="refresh" size={16} color="#fff" />
                      <Text style={st.retakeText}>Retake</Text>
                    </Pressable>
                  </View>

                  {analyzing && (
                    <View style={st.analyzing}>
                      <ActivityIndicator size="small" color="#D4A574" />
                      <Text style={st.analyzingText}>
                        AI is analyzing this image...
                      </Text>
                    </View>
                  )}

                  {result && !analyzing && (
                    <View style={st.resultCard}>
                      <Text style={st.resultTitle}>AI Analysis</Text>
                      <Text style={st.resultDesc}>{result.description}</Text>

                      <View style={st.tagRow}>
                        {result.suggestedBrand &&
                          result.suggestedBrand !== "Unknown" && (
                            <View style={st.tag}>
                              <Ionicons
                                name="pricetag"
                                size={12}
                                color="#D4A574"
                              />
                              <Text style={st.tagText}>
                                {result.suggestedBrand}
                              </Text>
                            </View>
                          )}
                        {result.suggestedCategory &&
                          result.suggestedCategory !== "Unknown" && (
                            <View style={st.tag}>
                              <Ionicons
                                name="folder"
                                size={12}
                                color="#D4A574"
                              />
                              <Text style={st.tagText}>
                                {result.suggestedCategory}
                              </Text>
                            </View>
                          )}
                        {result.suggestedColor &&
                          result.suggestedColor !== "Unknown" && (
                            <View style={st.tag}>
                              <Ionicons
                                name="color-palette"
                                size={12}
                                color="#D4A574"
                              />
                              <Text style={st.tagText}>
                                {result.suggestedColor}
                              </Text>
                            </View>
                          )}
                        {result.styleType && result.styleType !== "Unknown" && (
                          <View style={st.tag}>
                            <Ionicons
                              name="sparkles"
                              size={12}
                              color="#D4A574"
                            />
                            <Text style={st.tagText}>{result.styleType}</Text>
                          </View>
                        )}
                      </View>

                      {/* Find similar button */}
                      <TouchableOpacity
                        style={st.searchBtn}
                        onPress={handleFindSimilar}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="search" size={18} color="#fff" />
                        <Text style={st.searchBtnText}>
                          Find Similar in App ({matchingProducts.length} found)
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const st = StyleSheet.create({
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
    maxHeight: "88%",
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
    paddingVertical: 8,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#1B1B1B" },
  subtitle: {
    fontSize: 13,
    color: "#999",
    marginBottom: 20,
    lineHeight: 18,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  backText: { fontSize: 13, color: "#D4A574", fontWeight: "600" },

  /* Source buttons */
  sources: { flexDirection: "row", gap: 14, marginBottom: 20 },
  sourceBtn: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    paddingVertical: 24,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
  },
  sourceIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(212,165,116,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  sourceLabel: { fontSize: 14, fontWeight: "700", color: "#1B1B1B" },
  sourceDesc: { fontSize: 12, color: "#999", marginTop: 2 },

  /* Preview */
  previewWrap: { position: "relative", marginBottom: 16 },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
  },
  retakeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retakeText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  /* Analyzing */
  analyzing: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 20,
  },
  analyzingText: { fontSize: 14, color: "#666" },

  /* Result card */
  resultCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(212,165,116,0.2)",
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D4A574",
    marginBottom: 8,
  },
  resultDesc: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(212,165,116,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: { fontSize: 12, fontWeight: "600", color: "#8B6C4A" },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D4A574",
    borderRadius: 14,
    paddingVertical: 14,
  },
  searchBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  /* ── Product Results ── */
  miniPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  miniImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
  },
  miniLabel: { fontSize: 14, fontWeight: "700", color: "#1B1B1B" },
  miniDesc: { fontSize: 12, color: "#999", marginTop: 2 },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  matchBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#D4A574",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  matchText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productBrand: {
    fontSize: 10,
    color: "#999",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
    marginTop: 2,
  },
  productCategory: { fontSize: 11, color: "#BBB", marginTop: 2 },
  productPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D4A574",
    marginTop: 4,
  },

  /* Empty */
  emptyResult: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#999",
    marginTop: 12,
  },
  emptySubtitle: { fontSize: 13, color: "#BBB", marginTop: 4 },
});
