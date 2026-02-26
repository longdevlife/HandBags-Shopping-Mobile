import AsyncStorage from "@react-native-async-storage/async-storage";

const REVIEW_KEY = "@user_reviews";

/**
 * Get all user reviews for a specific product.
 */
export const getUserReviews = async (handbagName) => {
  try {
    const json = await AsyncStorage.getItem(REVIEW_KEY);
    const all = json ? JSON.parse(json) : {};
    return all[handbagName] || [];
  } catch (e) {
    console.error("Error reading user reviews:", e);
    return [];
  }
};

/**
 * Add a new user review for a product.
 * review shape: { rating, comment, photoUri? }
 */
export const addUserReview = async (handbagName, review) => {
  try {
    const json = await AsyncStorage.getItem(REVIEW_KEY);
    const all = json ? JSON.parse(json) : {};
    const productReviews = all[handbagName] || [];

    const newReview = {
      id: `user-${Date.now()}`,
      reviewer: "You",
      avatar: "Y",
      rating: review.rating,
      comment: review.comment,
      photoUri: review.photoUri || null,
      date: "Just now",
      isUser: true,
    };

    all[handbagName] = [newReview, ...productReviews];
    await AsyncStorage.setItem(REVIEW_KEY, JSON.stringify(all));
    return all[handbagName];
  } catch (e) {
    console.error("Error saving user review:", e);
    return [];
  }
};
