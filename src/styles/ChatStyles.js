import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const ChatStyles = StyleSheet.create({
  /* ── Layout ── */
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /* ── Header ── */
  header: {
    backgroundColor: "#1B1B1B",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D4A574",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 1,
  },
  resetBtn: {
    padding: 8,
  },

  /* ── Messages area ── */
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messagesContent: {
    paddingBottom: 12,
  },

  /* ── Welcome card (when empty) ── */
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  welcomeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(212,165,116,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E8E0D8",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  suggestionText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },

  /* ── Bubble ── */
  bubbleRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  bubbleRowUser: {
    justifyContent: "flex-end",
  },
  bubbleRowAI: {
    justifyContent: "flex-start",
  },
  aiAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D4A574",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
  },
  bubble: {
    maxWidth: width * 0.75,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: "#1B1B1B",
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#F0ECE6",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  bubbleTextUser: {
    fontSize: 14.5,
    color: "#FFFFFF",
    lineHeight: 21,
  },
  bubbleTextAI: {
    fontSize: 14.5,
    color: "#2C2C2C",
    lineHeight: 21,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
  },
  bubbleTimeUser: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "right",
  },
  bubbleTimeAI: {
    color: "#BBB",
  },

  /* ── Typing indicator ── */
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingLeft: 4,
  },
  typingBubble: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#F0ECE6",
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#D4A574",
  },

  /* ── Input bar ── */
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingBottom: 28,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: "#1B1B1B",
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D4A574",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendBtnDisabled: {
    backgroundColor: "#E8E0D8",
  },

  /* ── Error ── */
  errorBubble: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FFD4D4",
  },
  errorText: {
    color: "#CC4444",
  },
  retryBtn: {
    marginTop: 6,
    alignSelf: "flex-start",
  },
  retryText: {
    fontSize: 12,
    color: "#D4A574",
    fontWeight: "600",
  },
});
