export default async function handler(req, res) {
  const event = String(req.query.event || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{5,255}$/.test(event)) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  const base = (process.env.AUTOMATIQ_BASE_URL || "").trim();
  const token = (process.env.AUTOMATIQ_API_TOKEN || "").trim().split(/\s+/)[0];

  if (!base || !token) {
    return res.status(500).json({
      error: "Server is not configured",
      hasBaseUrl: Boolean(base),
      hasToken: Boolean(token),
    });
  }

  try {
    const url = new URL(`/api/ecomm/events/${event}/listings`, base);
    url.searchParams.set("page[size]", "500");
    url.searchParams.set("order_by", "price");
    url.searchParams.set("order_by_direction", "asc");

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
    console.error("Listings failed:", err.name);
    res.status(500).json({ error: "Listings failed" });
  }
}
