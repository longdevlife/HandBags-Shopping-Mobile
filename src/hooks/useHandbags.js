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
  const [loading, setLoading] = useState(true); // true initially to avoid empty flash
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

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

    if (selectedBrand !== "All") {
      result = result.filter((item) => item.brand === selectedBrand);
    }

    if (searchText.trim() !== "") {
      const keywords = searchText.toLowerCase();
      result = result.filter((item) =>
        item.handbagName.toLowerCase().includes(keywords),
      );
    }

    result.sort((a, b) => b.cost - a.cost);

    return result;
  }, [handbags, selectedBrand, searchText]);

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
  };
}
