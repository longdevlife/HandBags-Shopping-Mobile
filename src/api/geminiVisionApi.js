const API_KEY = "AIzaSyALm804Y7L4RnB_K4h45ym9gW121kPyEP4";
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Analyze a handbag image (base64) and return matching keywords
 * for searching the product catalog.
 * @param {string} base64Image - raw base64 encoded image data
 * @param {string} mimeType - e.g. "image/jpeg"
 * @returns {Promise<object>} { description, keywords[], suggestedCategory, suggestedColor }
 */
export async function analyzeHandbagImage(
  base64Image,
  mimeType = "image/jpeg",
) {
  const body = {
    system_instruction: {
      parts: [
        {
          text: `You are a luxury handbag identification expert. Analyze the image and respond ONLY with a valid JSON object (no markdown, no code fences) with these fields:
- "description": a brief 1-2 sentence description of the handbag
- "keywords": an array of 3-5 search keywords (bag type, style, features)
- "suggestedCategory": one of ["Crossbody","Shoulder Bag","Card Case","Card Holder","Wallets","Tote Bags"] or "Unknown"
- "suggestedColor": the primary color of the bag
- "suggestedBrand": best guess of the brand or "Unknown"
- "styleType": e.g. "Classic","Modern","Vintage","Casual","Formal"`,
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          { text: "Identify this handbag and extract search information:" },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
  };

  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Gemini Vision API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

  try {
    // Clean up any markdown code fences
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      description: text,
      keywords: [],
      suggestedCategory: "Unknown",
      suggestedColor: "Unknown",
      suggestedBrand: "Unknown",
      styleType: "Unknown",
    };
  }
}

/**
 * Ask AI about a specific product (for Detail screen).
 * Stateless — each call is independent.
 * @param {object} product - product info
 * @param {string} question - user's question about the product
 * @returns {Promise<string>} AI response text
 */
export async function askAboutProduct(product, question) {
  const productContext = `
Product: ${product.handbagName}
Brand: ${product.brand}
Category: ${product.category}
Price: $${product.cost}
Colors: ${product.color?.join(", ") || "N/A"}
Gender: ${product.gender ? "Women" : "Men"}
Discount: ${product.percentOff ? Math.round(product.percentOff * 100) + "%" : "None"}`;

  const body = {
    system_instruction: {
      parts: [
        {
          text: `You are LuxBag AI — a luxury handbag advisor. You are helping a customer learn about a specific product right now.

${productContext}

Respond with helpful, concise advice about THIS specific product. Topics you can help with:
• Material care & cleaning tips
• Styling suggestions & outfit pairing
• Whether it's good value for the price
• Size/capacity/practicality insights
• What occasions it's best for
• Comparison with similar products in our collection
• Authentication tips for this brand

Keep answers SHORT (under 150 words), friendly, with emojis sparingly. Answer in the user's language.`,
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: question }],
      },
    ],
  };

  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Gemini API ${res.status}`);
  }

  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sorry, I couldn't respond."
  );
}
