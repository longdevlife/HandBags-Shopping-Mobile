import { useMemo } from "react";
import { useFavorites } from "../context/FavoritesContext";

export function useDetail(item) {
  const { isFavorite, toggleFav } = useFavorites();

  const fav = isFavorite(item.handbagName);
  const computedData = useMemo(() => {
    const discountPercent = Math.round(item.percentOff * 100);
    const originalPrice = (item.cost / (1 - item.percentOff)).toFixed(0);
    const genderColor = item.gender ? "#4D96FF" : "#FF6B6B";
    const genderIcon = item.gender ? "woman" : "man";
    const genderLabel = item.gender ? "Female" : "Male";
    const colorText = item.color?.join(", ") || "N/A";
    return {
      discountPercent,
      originalPrice: Number(originalPrice),
      genderColor,
      genderIcon,
      genderLabel,
      colorText,
    };
  }, [item]);

  const handleToggle = () => toggleFav(item);

  return {
    fav,
    handleToggle,
    ...computedData,
  };
}
