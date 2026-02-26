import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@favorite_handbags";

export const getFavoriteList = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);

    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading value", e);
    return [];
  }
};

export const toggleFavorite = async (product) => {
  try {
    const currentList = await getFavoriteList();

    const existingIndex = currentList.findIndex(
      (item) => item.handbagName === product.handbagName,
    );

    let newList;
    if (existingIndex >= 0) {
      newList = currentList.filter(
        (item) => item.handbagName !== product.handbagName,
      );
      console.log("Removed from favorites:", product.handbagName);
    } else {
      newList = [...currentList, product];
      console.log("Added to favorites:", product.handbagName);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));

    return newList;
  } catch (e) {
    console.error("Error saving value", e);
    return [];
  }
};

export const checkIsFavorite = async (productName) => {
  try {
    const currentList = await getFavoriteList();
    return currentList.some((item) => item.handbagName === productName);
  } catch (e) {
    return false;
  }
};

export const clearFavorites = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (e) {
    console.error("Error clearing data", e);
    return [];
  }
};

export const removeFavorites = async (namesSet) => {
  try {
    const currentList = await getFavoriteList();
    const newList = currentList.filter(
      (item) => !namesSet.has(item.handbagName),
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    return newList;
  } catch (e) {
    console.error("Error batch removing favorites", e);
    return [];
  }
};
