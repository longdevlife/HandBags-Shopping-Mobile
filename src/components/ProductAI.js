import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { askAboutProduct } from "../api/geminiVisionApi";

const SUGGESTIONS = [
  "How should I care for this bag?",
  "What outfits go well with this?",
  "Is this bag worth the price?",
  "What occasions is this best for?",
  "How to spot a fake?",
];

export default function ProductAI({ product, visible, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendQuestion = async (question) => {
    const text = question || input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askAboutProduct(product, text);
      const aiMsg = { id: Date.now() + 1, role: "ai", text: reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: "Sorry, I couldn't respond right now. Please try again! 😔",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View style={[st.msgRow, isUser && st.msgRowUser]}>
        {!isUser && (
          <View style={st.aiAvatar}>
            <Ionicons name="sparkles" size={14} color="#fff" />
          </View>
        )}
        <View style={[st.bubble, isUser ? st.bubbleUser : st.bubbleAI]}>
          <Text style={[st.bubbleText, isUser && st.bubbleTextUser]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={st.overlay}
      >
        <View style={st.sheet}>
          {/* Handle + Header */}
          <View style={st.handleBar} />
          <View style={st.header}>
            <View style={st.headerLeft}>
              <View style={st.aiHeaderIcon}>
                <Ionicons name="sparkles" size={16} color="#fff" />
              </View>
              <View>
                <Text style={st.headerTitle}>Ask AI</Text>
                <Text style={st.headerSub}>{product.handbagName}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color="#999" />
            </Pressable>
          </View>

          {/* Chat area */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMessage}
            style={st.chatArea}
            contentContainerStyle={
              messages.length === 0 ? st.emptyChat : st.chatPad
            }
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListEmptyComponent={
              <View style={st.welcomeArea}>
                <View style={st.welcomeIcon}>
                  <Ionicons name="sparkles" size={36} color="#D4A574" />
                </View>
                <Text style={st.welcomeTitle}>
                  Ask me anything about{"\n"}
                  <Text style={{ color: "#D4A574" }}>
                    {product.handbagName}
                  </Text>
                </Text>
                <Text style={st.welcomeSub}>
                  Care tips, styling advice, value insights & more
                </Text>
                <View style={st.suggestionsWrap}>
                  {SUGGESTIONS.map((s, i) => (
                    <TouchableOpacity
                      key={i}
                      style={st.suggestion}
                      onPress={() => sendQuestion(s)}
                      activeOpacity={0.8}
                    >
                      <Text style={st.suggestionText}>{s}</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={12}
                        color="#D4A574"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }
          />

          {/* Loading indicator */}
          {loading && (
            <View style={st.typingRow}>
              <View style={st.aiAvatar}>
                <Ionicons name="sparkles" size={14} color="#fff" />
              </View>
              <View style={st.typingDots}>
                <ActivityIndicator size="small" color="#D4A574" />
                <Text style={st.typingText}>Thinking...</Text>
              </View>
            </View>
          )}

          {/* Input area */}
          <View style={st.inputRow}>
            <TextInput
              style={st.input}
              placeholder="Ask about this product..."
              placeholderTextColor="#BBB"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={300}
              onSubmitEditing={() => sendQuestion()}
            />
            <Pressable
              style={[st.sendBtn, input.trim() && !loading && st.sendBtnActive]}
              onPress={() => sendQuestion()}
              disabled={!input.trim() || loading}
            >
              <Ionicons
                name="send"
                size={18}
                color={input.trim() && !loading ? "#fff" : "#ccc"}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: "80%",
    minHeight: "55%",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  aiHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1B1B1B" },
  headerSub: { fontSize: 12, color: "#999", marginTop: 1 },

  /* Chat */
  chatArea: { flex: 1 },
  chatPad: { padding: 16, paddingBottom: 8 },
  emptyChat: { flex: 1, justifyContent: "center" },

  /* Messages */
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  msgRowUser: { flexDirection: "row-reverse" },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#D4A574",
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: "#D4A574",
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, color: "#333", lineHeight: 20 },
  bubbleTextUser: { color: "#fff" },

  /* Typing */
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  typingText: { fontSize: 13, color: "#999" },

  /* Welcome (empty state) */
  welcomeArea: { alignItems: "center", paddingHorizontal: 24 },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(212,165,116,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1B1B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 4,
  },
  welcomeSub: { fontSize: 13, color: "#999", marginBottom: 16 },
  suggestionsWrap: { width: "100%", gap: 6 },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  suggestionText: { fontSize: 13, color: "#555", flex: 1 },

  /* Input */
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    maxHeight: 80,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnActive: {
    backgroundColor: "#D4A574",
  },
});
