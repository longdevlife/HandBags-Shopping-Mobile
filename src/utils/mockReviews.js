/**
 * Deterministic mock reviews generator.
 * Produces consistent reviews for each product based on handbagName hash.
 */

const REVIEWERS = [
  { name: "Sarah M.", avatar: "S" },
  { name: "James L.", avatar: "J" },
  { name: "Emily K.", avatar: "E" },
  { name: "David W.", avatar: "D" },
  { name: "Olivia R.", avatar: "O" },
  { name: "Michael T.", avatar: "M" },
  { name: "Sophia N.", avatar: "So" },
  { name: "Daniel H.", avatar: "D" },
  { name: "Isabella P.", avatar: "I" },
  { name: "William C.", avatar: "W" },
  { name: "Ava B.", avatar: "A" },
  { name: "Ethan G.", avatar: "Et" },
];

const COMMENTS_5 = [
  "Absolutely stunning! The quality is outstanding and it looks even better in person.",
  "Worth every penny. The leather is so soft and the craftsmanship is impeccable.",
  "My new favorite bag! Gets compliments everywhere I go. Highly recommended!",
  "Perfect size for everyday use. The design is elegant and timeless.",
  "Exceeded my expectations! Beautiful color and amazing attention to detail.",
];

const COMMENTS_4 = [
  "Great bag overall. Minor stitching detail could be better but still love it.",
  "Really nice quality. Slightly smaller than expected but very functional.",
  "Beautiful design and good material. Zipper is a bit stiff but breaking in nicely.",
  "Love the color and style. Delivery was fast and packaging was premium.",
  "Very happy with this purchase. Would be perfect with an extra pocket inside.",
];

const COMMENTS_3 = [
  "Decent bag for the price. Color was slightly different from the pictures.",
  "Good quality materials but the strap could be more comfortable for long wear.",
  "Nice design but took a while to arrive. Leather smell was strong at first.",
];

const COMMENTS_2 = [
  "Expected better quality for this price range. Material feels a bit thin.",
  "The color faded slightly after a few weeks. Design is nice though.",
];

const COMMENTS_1 = [
  "Not what I expected. The hardware felt cheap compared to pictures.",
];

const COMMENT_MAP = {
  5: COMMENTS_5,
  4: COMMENTS_4,
  3: COMMENTS_3,
  2: COMMENTS_2,
  1: COMMENTS_1,
};

const DATES = [
  "2 days ago",
  "1 week ago",
  "2 weeks ago",
  "3 weeks ago",
  "1 month ago",
  "2 months ago",
  "3 months ago",
  "4 months ago",
  "5 months ago",
  "6 months ago",
];

/* Simple string hash → number */
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* Seeded pseudo-random */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * Generate deterministic reviews for a product.
 * @param {string} handbagName
 * @returns {{ reviews: Array, averageRating: number, totalReviews: number, ratingBreakdown: Object }}
 */
export function getProductReviews(handbagName) {
  const hash = hashStr(handbagName);
  const rand = seededRandom(hash);

  // 5–12 reviews per product
  const count = 5 + Math.floor(rand() * 8);

  // Generate rating distribution weighted towards 4-5 stars
  const reviews = [];
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  for (let i = 0; i < count; i++) {
    const r = rand();
    let rating;
    if (r < 0.4) rating = 5;
    else if (r < 0.72) rating = 4;
    else if (r < 0.88) rating = 3;
    else if (r < 0.96) rating = 2;
    else rating = 1;

    breakdown[rating]++;

    const reviewer = REVIEWERS[Math.floor(rand() * REVIEWERS.length)];
    const comments = COMMENT_MAP[rating];
    const comment = comments[Math.floor(rand() * comments.length)];
    const date = DATES[Math.floor(rand() * DATES.length)];

    reviews.push({
      id: `${handbagName}-${i}`,
      reviewer: reviewer.name,
      avatar: reviewer.avatar,
      rating,
      comment,
      date,
    });
  }

  const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = Number((totalRatings / count).toFixed(1));

  return {
    reviews,
    averageRating,
    totalReviews: count,
    ratingBreakdown: breakdown,
  };
}
