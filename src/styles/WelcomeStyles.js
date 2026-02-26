import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const WelcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 46,
    letterSpacing: 0.5,
  },
  titleHighlight: {
    color: "#D4A574",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 16,
    marginBottom: 30,
  },
  button: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
