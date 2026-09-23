const SEARCH_PATH = "/api/search/events";
const KEYWORD_PARAM = "q";

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Missing search term" });

  const base = process.env.AUTOMATIQ_BASE_URL;
  const token = process.env.AUTOMATIQ_API_TOKEN;

  // Shows only whether the variables exist, never their values
  if (!base || !token) {
    return res.status(500).json({
      error: "Missing environment variable",
      hasBaseUrl: Boolean(base),
      hasToken: Boolean(token),
    });
  }

  try {
    const url = new URL(SEARCH_PATH, base.trim());
    url.searchParams.set(KEYWORD_PARAM, q);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: "application/json",
      },
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 500) }; }

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Search failed", detail: String(err.message || err) });
  }
}
