import { StyleSheet } from "react-native";

export const OrderDetailStyles = StyleSheet.create({
  /* ── Layout ── */
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  /* ── Header ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#fff",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  /* ── Status Banner ── */
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  statusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  statusDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  methodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(77,150,255,0.1)",
  },
  methodBadgePickup: {
    backgroundColor: "rgba(212,165,116,0.1)",
  },
  methodBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4D96FF",
  },
  methodBadgeTextPickup: {
    color: "#D4A574",
  },

  /* ── Section ── */
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 10,
  },

  /* ── Product Card ── */
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  productBrand: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1B1B",
    lineHeight: 20,
  },
  productCategory: {
    fontSize: 12,
    color: "#BBB",
    marginTop: 2,
  },
  productBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#D4A574",
  },
  productQty: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },

  /* ── Info Card ── */
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(212,165,116,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#BBB",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  infoSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  infoSeparator: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginVertical: 14,
  },

  /* ── Timeline ── */
  timelineCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 14,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B1B1B",
  },
  timelineDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  /* ── Payment Summary ── */
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#999",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B1B1B",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#D4A574",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
  },
  paymentIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },

  /* ── Order ID ── */
  orderIdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  orderIdLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#BBB",
  },
  orderIdValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },

  /* ── Bottom Bar ── */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
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
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D4A574",
    borderRadius: 16,
    paddingVertical: 16,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
