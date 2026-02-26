import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const DetailStyles = StyleSheet.create({
  /* ── Layout ── */
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  scroll: { flex: 1 },

  /* ── Image ── */
  imageWrapper: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1B1B1B",
  },
  image: {
    width: "100%",
    height: width * 0.75,
    borderRadius: 20,
  },

  /* ── Body ── */
  body: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 6,
  },
  subtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: "#999" },
  iconGroup: { flexDirection: "row", gap: 8 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(245,166,35,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F5A623",
  },
  ratingBadgeCount: {
    fontSize: 11,
    color: "#999",
  },
  genderDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Divider ── */
  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 18,
  },

  /* ── Description ── */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 10,
  },
  descText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  readMore: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D4A574",
    marginTop: 6,
  },

  /* ── Info Card ── */
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },
  infoLabel: { fontSize: 14, color: "#999" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#1B1B1B" },

  /* ── Color Chips ── */
  colorRow: { flexDirection: "row", gap: 10 },
  colorChip: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  colorChipActive: {
    borderColor: "#D4A574",
    backgroundColor: "rgba(212,165,116,0.08)",
  },
  colorChipText: { fontSize: 13, fontWeight: "600", color: "#666" },
  colorChipTextActive: { color: "#D4A574" },

  /* ── Bottom Bar ── */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -4 },
  },
  bottomLabel: { fontSize: 12, color: "#999" },
  bottomPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D4A574",
    marginTop: 2,
  },
  actionBtn: {
    marginLeft: 20,
    backgroundColor: "#D4A574",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnActive: { backgroundColor: "#888" },
  actionBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  /* ── Ratings Summary ── */
  ratingSummary: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  ratingLeft: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  ratingBig: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1B1B1B",
    lineHeight: 44,
  },
  ratingCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  ratingRight: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    width: 12,
    textAlign: "right",
  },
  breakdownBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F0F0F0",
    overflow: "hidden",
  },
  breakdownBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#F5A623",
  },
  breakdownCount: {
    fontSize: 11,
    color: "#999",
    width: 18,
    textAlign: "right",
  },

  /* ── Review List ── */
  reviewList: {
    marginTop: 16,
    gap: 12,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  reviewAvatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  reviewDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 1,
  },
  reviewComment: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  showAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    marginTop: 4,
  },
  showAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D4A574",
  },
});
