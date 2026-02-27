import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const MapStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  /* ── Map ── */
  map: {
    width,
    height: height * 0.45,
  },

  /* ── Markers ── */
  markerWarehouse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1B1B1B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  markerCustomer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  markerDriver: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    elevation: 6,
  },

  /* ── Bottom Sheet ── */
  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 16,
  },

  /* ── ETA Row ── */
  etaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  etaLabel: {
    fontSize: 12,
    color: "#999",
  },
  etaTime: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1B1B1B",
    marginTop: 2,
  },
  progressPill: {
    backgroundColor: "rgba(76,175,80,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressPillText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
  },

  /* ── Progress Bar ── */
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },

  /* ── Delivery Steps ── */
  stepsContainer: {
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    position: "relative",
  },
  stepLine: {
    position: "absolute",
    left: 15,
    top: -12,
    width: 2,
    height: 12,
    backgroundColor: "#E0E0E0",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepCircleDone: {
    backgroundColor: "#4CAF50",
  },
  stepCircleActive: {
    backgroundColor: "#D4A574",
  },
  stepTextWrap: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CCC",
  },
  stepDesc: {
    fontSize: 11,
    color: "#BBB",
    marginTop: 1,
  },

  /* ── Driver Info ── */
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  driverAvatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1B1B",
  },
  driverRole: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(212,165,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  msgBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(212,165,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Order Item (small) ── */
  orderItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  orderItemImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    marginRight: 12,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B1B1B",
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#D4A574",
  },

  /* ── Empty State ── */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#F5F5F5",
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
  },
});
