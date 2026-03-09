import { useCallback, useEffect, useMemo, useState } from "react";
import { getHandbags } from "../api/handbagApi";

const BRANDS = [
  "All",
  "Bvlgari",
  "Michael Kors",
  "Burberry",
  "Ferragamo",
  "Fendi",
];

export function useHandbags() {
  const [handbags, setHandbags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  /* ── Advanced filters (from FilterModal) ── */
  const [filters, setFilters] = useState({
    category: "All",
    sortBy: "price_desc",
    gender: "all",
  });

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getHandbags();
      setHandbags(data);
    } catch (err) {
      setError("Failed to load handbags. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Pull-to-refresh handler */
  const refetch = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getHandbags();
      setHandbags(data);
    } catch (err) {
      setError("Failed to refresh. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const filteredData = useMemo(() => {
    let result = [...handbags];

    /* Brand filter */
    if (selectedBrand !== "All") {
      result = result.filter((item) => item.brand === selectedBrand);
    }

    /* Category filter */
    if (filters.category !== "All") {
      result = result.filter((item) => item.category === filters.category);
    }

    /* Gender filter */
    if (filters.gender !== "all") {
      const genderBool = filters.gender === "true";
      result = result.filter((item) => item.gender === genderBool);
    }

    /* Search */
    if (searchText.trim() !== "") {
      const keywords = searchText.toLowerCase();
      result = result.filter((item) =>
        item.handbagName.toLowerCase().includes(keywords),
      );
    }

    /* Sort */
    switch (filters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.cost - b.cost);
        break;
      case "discount":
        result.sort((a, b) => b.percentOff - a.percentOff);
        break;
      case "name_asc":
        result.sort((a, b) => a.handbagName.localeCompare(b.handbagName));
        break;
      case "price_desc":
      default:
        result.sort((a, b) => b.cost - a.cost);
        break;
    }

    return result;
  }, [handbags, selectedBrand, searchText, filters]);

  /* Check if any advanced filter is active (for badge indicator) */
  const hasActiveFilters =
    filters.category !== "All" ||
    filters.sortBy !== "price_desc" ||
    filters.gender !== "all";

  return {
    filteredData,
    loading,
    refreshing,
    refetch,
    error,
    searchText,
    setSearchText,
    selectedBrand,
    setSelectedBrand,
    BRANDS,
    filters,
    setFilters,
    hasActiveFilters,
  };
}
