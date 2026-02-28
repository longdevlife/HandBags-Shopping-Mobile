import { StyleSheet } from "react-native";

export const OrderHistoryStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  /* ── Header ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#fff",
    gap: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  headerCount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
  },

  /* ── Filter Tabs ── */
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tabBtn: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  tabBtnActive: {
    backgroundColor: "#D4A574",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },
  tabTextActive: {
    color: "#fff",
  },

  /* ── List ── */
  listPad: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* ── Order Card ── */
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTop: {
    flexDirection: "row",
    marginBottom: 12,
  },
  orderImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
  },
  orderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  orderName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 2,
  },
  orderBrand: {
    fontSize: 12,
    color: "#999",
    marginBottom: 6,
  },
  qtyDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orderQty: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  orderDate: {
    fontSize: 12,
    color: "#BBB",
  },

  /* ── Card Bottom ── */
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  priceRow: {
    alignItems: "flex-end",
  },
  deliveryLabel: {
    fontSize: 11,
    color: "#BBB",
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#D4A574",
  },

  /* ── Track Row ── */
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  trackText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D4A574",
    flex: 1,
  },

  /* ── Empty State ── */
  emptyContainer: { flex: 1 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(212,165,116,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: "#D4A574",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
  },
  browseBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  /* ── Pick Up Row ── */
  pickupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  pickupText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4CAF50",
    flex: 1,
  },

  /* ── Store Info (in order card) ── */
  storeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  storeInfoName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1B1B1B",
  },
  storeInfoAddr: {
    fontSize: 11,
    color: "#999",
    marginTop: 1,
  },

  /* ── Completed Row ── */
  completedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  completedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },

  /* ── Confirm Pickup Modal ── */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(212,165,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalConfirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D4A574",
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    marginBottom: 10,
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  modalCancelBtn: {
    paddingVertical: 10,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
});
