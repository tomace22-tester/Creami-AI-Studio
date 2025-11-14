export default async function handler(req, res) {
  try {
    const body = req.body ? JSON.parse(req.body) : {};
    const { userPrompt, systemPrompt } = body;

    const response = await fetch("/api/creami", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userPrompt,
        systemPrompt
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
