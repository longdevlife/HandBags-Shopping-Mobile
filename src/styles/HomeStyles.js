import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_HPAD = 16;
const cardWidth = (width - CARD_HPAD * 2 - CARD_GAP) / 2;

export const HomeStyles = StyleSheet.create({
  /* ── Layout ── */
  container: { flex: 1, backgroundColor: "#1B1B1B" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* ── Dark Zone (header + search together) ── */
  darkZone: {
    backgroundColor: "#1B1B1B",
    paddingTop: 6,
    paddingBottom: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerLabel: { fontSize: 12, color: "#A0A0A0", marginBottom: 2 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },

  /* ── Search Bar (inside dark zone) ── */
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: "#fff" },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Promo Banner ── */
  bannerSection: {
    position: "relative",
    marginHorizontal: -CARD_HPAD,
  },
  bannerDarkHalf: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#1B1B1B",
  },
  bannerWrapper: {
    paddingHorizontal: CARD_HPAD,
    paddingTop: 8,
    paddingBottom: 16,
  },
  banner: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    height: 140,
  },
  bannerContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  promoBadge: {
    backgroundColor: "#FF6B6B",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  promoLabel: { color: "#fff", fontSize: 12, fontWeight: "700" },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  bannerImage: {
    width: 140,
    height: 140,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },

  /* ── Brand Chips ── */
  brandList: { paddingHorizontal: 0, paddingTop: 14, paddingBottom: 14 },
  brandChip: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  brandChipActive: {
    backgroundColor: "#D4A574",
    borderColor: "#D4A574",
  },
  brandText: { fontSize: 13, fontWeight: "600", color: "#333" },
  brandTextActive: { color: "#fff" },

  /* ── Product List ── */
  listContainer: {
    paddingHorizontal: CARD_HPAD,
    paddingBottom: 24,
    backgroundColor: "#F5F5F5",
  },

  /* ── Product Card ── */
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: CARD_GAP,
    marginRight: CARD_GAP,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imageWrapper: {
    position: "relative",
    backgroundColor: "#F8F8F8",
  },
  image: {
    width: "100%",
    height: cardWidth * 0.85,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: { color: "#fff", fontSize: 10, fontWeight: "800" },

  infoContainer: { padding: 10 },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 2,
  },
  categoryText: { fontSize: 12, color: "#999", marginBottom: 8 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 16, fontWeight: "800", color: "#1B1B1B" },
  heartBtn: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnActive: {
    backgroundColor: "#FF6B6B",
  },
});
