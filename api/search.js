export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Missing search term" });

  try {
    // Replace the path and query param name with the real ones from the docs
    const url = `${process.env.AUTOMATIQ_BASE_URL}/YOUR-EVENT-SEARCH-ENDPOINT?q=${encodeURIComponent(q)}`;

    const response = await fetch(url, {
      headers: {
        // Replace with the auth scheme Automatiq specifies
        Authorization: `Bearer ${process.env.AUTOMATIQ_API_TOKEN}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
}
