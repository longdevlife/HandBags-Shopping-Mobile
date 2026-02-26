import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useFavorites } from "../context/FavoritesContext";

export function useFavoriteList() {
  const { favorites, toggleFav, clearFav, removeBatch, reloadFavorites } =
    useFavorites();

  /* Multi-select state */
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  useFocusEffect(
    useCallback(() => {
      reloadFavorites();
    }, [reloadFavorites]),
  );

  /* Enter select mode via long press */
  const handleLongPress = useCallback((item) => {
    setSelectMode(true);
    setSelected(new Set([item.handbagName]));
  }, []);

  /* Toggle selection in select mode */
  const toggleSelect = useCallback((item) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item.handbagName)) {
        next.delete(item.handbagName);
      } else {
        next.add(item.handbagName);
      }
      // Exit select mode if nothing selected
      if (next.size === 0) setSelectMode(false);
      return next;
    });
  }, []);

  /* Select / deselect all */
  const selectAll = useCallback(() => {
    if (selected.size === favorites.length) {
      setSelected(new Set());
      setSelectMode(false);
    } else {
      setSelected(new Set(favorites.map((f) => f.handbagName)));
    }
  }, [favorites, selected.size]);

  /* Cancel select mode */
  const cancelSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelected(new Set());
  }, []);

  /* Delete selected items immediately */
  const handleDeleteSelected = useCallback(() => {
    if (selected.size === 0) return;
    removeBatch(selected);
    setSelectMode(false);
    setSelected(new Set());
  }, [selected, removeBatch]);

  const handleDeleteOne = useCallback(
    (item) => {
      toggleFav(item);
    },
    [toggleFav],
  );

  const handleClearAll = useCallback(() => {
    clearFav();
  }, [clearFav]);

  return {
    favorites,
    handleDeleteOne,
    handleClearAll,
    /* multi-select */
    selectMode,
    selected,
    handleLongPress,
    toggleSelect,
    selectAll,
    cancelSelectMode,
    handleDeleteSelected,
  };
}
