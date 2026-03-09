const API_KEY = "AIzaSyALm804Y7L4RnB_K4h45ym9gW121kPyEP4";
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `You are LuxBag AI — a luxury handbag expert and personal shopping assistant.
You help users with:
• Handbag recommendations based on style, occasion, or budget
• Care tips for leather, canvas, and exotic materials
• Brand knowledge (Bvlgari, Michael Kors, Burberry, Ferragamo, Fendi, etc.)
• Styling advice and outfit pairing
• Authentication tips to spot fakes
• Price comparisons and value insights

Personality:
- Friendly, knowledgeable, and elegant
- Use short, clear paragraphs
- Include relevant emojis sparingly (👜 ✨ 💎)
- Answer in the same language the user writes in
- Keep responses concise (under 200 words unless detail is requested)
- If asked about something unrelated to fashion/handbags, politely redirect`;

/* Chat history stored as Gemini-format objects */
let history = [];

/** helper: wait ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Send a message via Gemini REST API (direct fetch — no SDK)
 * Auto-retries once on 429 rate-limit after waiting the suggested delay.
 * @param {string} userMessage
 * @returns {Promise<string>} AI response text
 */
export async function sendMessage(userMessage) {
  /* Add user turn to history */
  history.push({ role: "user", parts: [{ text: userMessage }] });

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: history,
  };

  const doRequest = () =>
    fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  let res = await doRequest();

  /* Auto-retry once on 429 */
  if (res.status === 429) {
    const errBody = await res.json().catch(() => ({}));
    const retryDetail = errBody?.error?.details?.find((d) =>
      d["@type"]?.includes("RetryInfo"),
    );
    const delaySec = parseFloat(retryDetail?.retryDelay) || 50;
    console.log(`[Gemini] Rate limited — retrying in ${Math.ceil(delaySec)}s…`);
    await sleep(delaySec * 1000);
    res = await doRequest();
  }

  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown error");
    console.error("[Gemini Error]", res.status, err);
    /* Remove user message on failure so it can be retried */
    history.pop();
    throw new Error(`Gemini API ${res.status}`);
  }

  const data = await res.json();
  const aiText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response received.";

  /* Add model turn to history */
  history.push({ role: "model", parts: [{ text: aiText }] });

  return aiText;
}

/**
 * Reset chat history
 */
export function resetChat() {
  history = [];
}
