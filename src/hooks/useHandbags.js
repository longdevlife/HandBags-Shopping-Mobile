import { useEffect, useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getHandbags();
        setHandbags(data);
      } catch (err) {
        setError("error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    error,
    searchText,
    setSearchText,
    selectedBrand,
    setSelectedBrand,
    BRANDS,
  };
}
