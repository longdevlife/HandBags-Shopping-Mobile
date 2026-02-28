import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendMessage, resetChat } from "../api/geminiApi";
import { ChatStyles as s } from "../styles/ChatStyles";

const SUGGESTIONS = [
  "Recommend a bag under $500",
  "How to care for leather?",
  "Bvlgari vs Fendi?",
  "Style a crossbody bag",
  "How to spot a fake?",
  "Gift ideas for her",
];

/* ── Typing dots animation ── */
function TypingIndicator() {
  const dots = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
  ];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);

  return (
    <View style={s.typingRow}>
      <View style={s.typingBubble}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[s.typingDot, { opacity: dot }]} />
        ))}
      </View>
    </View>
  );
}

/* ── Format time ── */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ── Message bubble ── */
function MessageBubble({ item, onRetry }) {
  const isUser = item.role === "user";
  const isError = item.isError;

  return (
    <View style={[s.bubbleRow, isUser ? s.bubbleRowUser : s.bubbleRowAI]}>
      <View
        style={[
          s.bubble,
          isUser ? s.bubbleUser : s.bubbleAI,
          isError && s.errorBubble,
        ]}
      >
        <Text
          style={[
            isUser ? s.bubbleTextUser : s.bubbleTextAI,
            isError && s.errorText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[s.bubbleTime, isUser ? s.bubbleTimeUser : s.bubbleTimeAI]}
        >
          {formatTime(item.time)}
        </Text>
        {isError && (
          <Pressable style={s.retryBtn} onPress={() => onRetry(item)}>
            <Text style={s.retryText}>Tap to retry</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ── Main screen ── */
export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  /* Send a message */
  const handleSend = useCallback(
    async (text) => {
      const msg = (text || inputText).trim();
      if (!msg || isLoading) return;

      Keyboard.dismiss();
      setInputText("");

      const userMsg = {
        id: Date.now().toString(),
        role: "user",
        text: msg,
        time: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      scrollToEnd();

      try {
        const reply = await sendMessage(msg);
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: reply,
          time: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const is429 = err.message?.includes("429");
        const errMsg = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: is429
            ? "Rate limit reached — please wait a minute and try again."
            : "Sorry, I couldn't process that. Please try again.",
          time: new Date(),
          isError: true,
          originalUserText: msg,
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
        scrollToEnd();
      }
    },
    [inputText, isLoading, scrollToEnd],
  );

  /* Retry a failed message */
  const handleRetry = useCallback(
    (errorMsg) => {
      setMessages((prev) => prev.filter((m) => m.id !== errorMsg.id));
      handleSend(errorMsg.originalUserText);
    },
    [handleSend],
  );

  /* Reset conversation */
  const handleReset = useCallback(() => {
    resetChat();
    setMessages([]);
  }, []);

  /* ── Welcome view ── */
  const renderWelcome = () => (
    <View style={s.welcomeContainer}>
      <Text style={s.welcomeTitle}>LuxBag AI</Text>
      <Text style={s.welcomeSubtitle}>
        Your personal luxury handbag advisor.{"\n"}Ask me anything about brands,
        styling, care tips, or finding the perfect bag.
      </Text>
      <View style={s.suggestionsRow}>
        {SUGGESTIONS.map((sug) => (
          <Pressable
            key={sug}
            style={s.suggestionChip}
            onPress={() => handleSend(sug)}
          >
            <Text style={s.suggestionText}>{sug}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const canSend = inputText.trim().length > 0 && !isLoading;

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>AI</Text>
          </View>
          <View>
            <Text style={s.headerTitle}>LuxBag AI</Text>
            <Text style={s.headerSubtitle}>Powered by Gemini</Text>
          </View>
        </View>
        {messages.length > 0 && (
          <Pressable style={s.resetBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={22} color="#A0A0A0" />
          </Pressable>
        )}
      </View>

      {/* Messages or Welcome */}
      {messages.length === 0 ? (
        renderWelcome()
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={s.messagesList}
          contentContainerStyle={s.messagesContent}
          renderItem={({ item }) => (
            <MessageBubble item={item} onRetry={handleRetry} />
          )}
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Input bar */}
      <View style={s.inputBar}>
        <TextInput
          style={s.textInput}
          placeholder="Ask about handbags..."
          placeholderTextColor="#B0B0B0"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
          blurOnSubmit
        />
        <Pressable
          style={[s.sendBtn, !canSend && s.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!canSend}
        >
          <Ionicons name="send" size={18} color="#FFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
