import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const MapStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  /* ── Full-screen map (used for both modes) ── */
  mapFull: {
    ...StyleSheet.absoluteFillObject,
  },

  /* ── Markers (Delivery) ── */
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

  /* ── Markers (Store Locator) ── */
  storeMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  storeMarkerSelected: {
    backgroundColor: "#1B1B1B",
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: "#D4A574",
  },

  /* ── Floating Header (Store Locator) ── */
  floatingHeader: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1B1B1B",
  },
  locateBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(212,165,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Bottom Sheet ── */
  sheetBg: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    marginLeft: 8,
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

  /* ═══════════════════
     STORE LOCATOR
     ═══════════════════ */

  /* ── Store List ── */
  storeListTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 4,
  },
  storeListSubtitle: {
    fontSize: 13,
    color: "#999",
    marginBottom: 16,
  },

  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  storeCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(212,165,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  storeCardInfo: {
    flex: 1,
  },
  storeCardName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 2,
  },
  storeCardAddress: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  storeCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  storeCardMetaText: {
    fontSize: 11,
    color: "#999",
  },
  storeCardDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#CCC",
    marginHorizontal: 4,
  },

  /* ── Store Detail ── */
  backToList: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  backToListText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D4A574",
  },

  storeDetailHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  storeDetailIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(212,165,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  storeDetailName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B1B1B",
    textAlign: "center",
    marginBottom: 4,
  },
  storeDetailAddress: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },

  /* ── Info Grid ── */
  storeInfoGrid: {
    gap: 12,
    marginBottom: 20,
  },
  storeInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    padding: 14,
  },
  storeInfoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(212,165,116,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  storeInfoLabel: {
    fontSize: 11,
    color: "#999",
  },
  storeInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B1B1B",
    marginTop: 1,
  },

  /* ── Action Buttons ── */
  storeActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  storeActionPrimary: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D4A574",
    borderRadius: 14,
    paddingVertical: 14,
  },
  storeActionPrimaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  storeActionSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(212,165,116,0.12)",
    borderRadius: 14,
    paddingVertical: 14,
  },
  storeActionSecondaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D4A574",
  },

  /* ── Delivered Overlay ── */
  deliveredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  deliveredCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: width * 0.82,
  },
  deliveredIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(76,175,80,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  deliveredTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 8,
  },
  deliveredSubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  deliveredBtn: {
    backgroundColor: "#D4A574",
    borderRadius: 14,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  deliveredBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  deliveredSecondary: {
    paddingVertical: 10,
  },
  deliveredSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D4A574",
  },
});
