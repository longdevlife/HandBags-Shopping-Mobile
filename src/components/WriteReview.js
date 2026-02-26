import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { DetailStyles as s } from "../styles/DetailStyles";

export default function WriteReview({ onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ── Pick image from gallery ── */
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library to add images.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  /* ── Take photo with camera ── */
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow camera access to take photos.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  /* ── Show picker options ── */
  const handleAddPhoto = () => {
    Alert.alert("Add Photo", "Choose a source", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }
    if (comment.trim().length === 0) {
      Alert.alert("Comment required", "Please write a short review.");
      return;
    }
    setSubmitting(true);
    await onSubmit({ rating, comment: comment.trim(), photoUri });
    setSubmitting(false);
    // Reset form
    setRating(0);
    setComment("");
    setPhotoUri(null);
  };

  return (
    <View style={s.writeReviewCard}>
      {/* Header */}
      <View style={s.writeReviewHeader}>
        <Text style={s.writeReviewTitle}>Write a Review</Text>
        {onCancel && (
          <Pressable onPress={onCancel} hitSlop={10}>
            <Ionicons name="close" size={20} color="#999" />
          </Pressable>
        )}
      </View>

      {/* Star Rating */}
      <Text style={s.writeReviewLabel}>Your Rating</Text>
      <View style={s.starInputRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)} hitSlop={4}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color={star <= rating ? "#F5A623" : "#D0D0D0"}
            />
          </Pressable>
        ))}
        {rating > 0 && <Text style={s.starInputText}>{rating}/5</Text>}
      </View>

      {/* Comment Input */}
      <Text style={s.writeReviewLabel}>Your Review</Text>
      <TextInput
        style={s.commentInput}
        placeholder="Share your experience with this handbag..."
        placeholderTextColor="#BBB"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={comment}
        onChangeText={setComment}
        maxLength={300}
      />
      <Text style={s.charCount}>{comment.length}/300</Text>

      {/* Photo Section */}
      <Text style={s.writeReviewLabel}>Add Photo (Optional)</Text>
      <View style={s.photoSection}>
        {photoUri ? (
          <View style={s.photoPreviewWrapper}>
            <Image source={{ uri: photoUri }} style={s.photoPreview} />
            <Pressable
              style={s.photoRemoveBtn}
              onPress={() => setPhotoUri(null)}
              hitSlop={6}
            >
              <Ionicons name="close-circle" size={22} color="#FF6B6B" />
            </Pressable>
          </View>
        ) : (
          <TouchableOpacity
            style={s.addPhotoBtn}
            onPress={handleAddPhoto}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={28} color="#D4A574" />
            <Text style={s.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[
          s.submitReviewBtn,
          (rating === 0 || comment.trim().length === 0) &&
            s.submitReviewBtnDisabled,
        ]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Ionicons name="send" size={16} color="#fff" />
        <Text style={s.submitReviewText}>
          {submitting ? "Submitting..." : "Submit Review"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
