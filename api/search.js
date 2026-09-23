const SEARCH_PATH = "/api/search/events";
const KEYWORD_PARAM = "q";

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Missing search term" });

  const base = (process.env.AUTOMATIQ_BASE_URL || "").trim();
  // Keep only the first token in case extra text or lines were pasted
  const token = (process.env.AUTOMATIQ_API_TOKEN || "").trim().split(/\s+/)[0];

  if (!base || !token) {
    return res.status(500).json({
      error: "Server is not configured",
      hasBaseUrl: Boolean(base),
      hasToken: Boolean(token),
    });
  }

  try {
    const url = new URL(SEARCH_PATH, base);
    url.searchParams.set(KEYWORD_PARAM, q);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 500) }; }

    res.status(response.status).json(data);
  } catch (err) {
    console.error("Search failed:", err.name);
    res.status(500).json({ error: "Search failed" });
  }
}
