import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getFavoriteList,
  toggleFavorite,
  clearFavorites,
  removeFavorites,
} from "../utils/storage";

const FavoritesContext = createContext(undefined);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavoriteList().then(setFavorites);
  }, []);

  const isFavorite = useCallback(
    (itemName) => favorites.some((fav) => fav.handbagName === itemName),
    [favorites],
  );

  const toggleFav = useCallback(async (item) => {
    const updatedList = await toggleFavorite(item);
    setFavorites(updatedList);
  }, []);

  const clearFav = useCallback(async () => {
    await clearFavorites();
    setFavorites([]);
  }, []);

  const removeBatch = useCallback(async (namesSet) => {
    const updatedList = await removeFavorites(namesSet);
    setFavorites(updatedList);
  }, []);

  const reloadFavorites = useCallback(async () => {
    const list = await getFavoriteList();
    setFavorites(list);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFav,
        clearFav,
        removeBatch,
        reloadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error(
      "useFavorites() phải được dùng bên trong <FavoritesProvider>",
    );
  }

  return context;
}
