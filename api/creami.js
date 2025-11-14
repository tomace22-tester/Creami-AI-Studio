// /api/creami.js
export default async function handler(req, res) {
  try {
    // Vercel supplies req.body as an object for JSON requests,
    // but we handle both just in case.
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { userPrompt, systemPrompt } = body || {};

    if (!userPrompt || !systemPrompt) {
      res.status(400).json({ error: "Missing userPrompt or systemPrompt" });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "OPENAI_API_KEY is not set on the server." });
      return;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ error: text });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error("API error:", e);
    res.status(500).json({ error: e.message || "Unknown server error" });
  }
}
