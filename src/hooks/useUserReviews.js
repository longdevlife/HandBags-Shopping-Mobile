import { useCallback, useEffect, useState } from "react";
import { getUserReviews, addUserReview } from "../utils/reviewStorage";

export function useUserReviews(handbagName) {
  const [userReviews, setUserReviews] = useState([]);

  const load = useCallback(async () => {
    const data = await getUserReviews(handbagName);
    setUserReviews(data);
  }, [handbagName]);

  useEffect(() => {
    load();
  }, [load]);

  const submitReview = useCallback(
    async (review) => {
      const updated = await addUserReview(handbagName, review);
      setUserReviews(updated);
    },
    [handbagName],
  );

  return { userReviews, submitReview };
}
