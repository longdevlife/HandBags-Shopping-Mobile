import { useState, useEffect } from "react";
import * as Location from "expo-location";

/* Fallback: center of Ho Chi Minh City */
const FALLBACK = { latitude: 10.7769, longitude: 106.7009 };

/**
 * Hook that requests location permission and returns the user's
 * real GPS coordinates.  Falls back to HCM center on denial / error.
 *
 * @returns {{ location, loading, error, refresh }}
 *  - location  : { latitude, longitude }
 *  - loading   : boolean (true while fetching first fix)
 *  - error     : string | null
 *  - refresh() : manually re‑fetch location
 */
export default function useUserLocation() {
  const [location, setLocation] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        setLocation(FALLBACK);
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch (e) {
      console.warn("Location error:", e.message);
      setError(e.message);
      setLocation(FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return { location, loading, error, refresh: fetchLocation };
}

export { FALLBACK };
