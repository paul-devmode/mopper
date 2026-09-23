const SEARCH_PATH = "/api/search/events";
const KEYWORD_PARAM = "q"; // change if the docs say query, keyword, search, etc.

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Missing search term" });

  try {
    const url = new URL(SEARCH_PATH, process.env.AUTOMATIQ_BASE_URL);
    url.searchParams.set(KEYWORD_PARAM, q);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.AUTOMATIQ_API_TOKEN}`,
        Accept: "application/json",
      },
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
}
