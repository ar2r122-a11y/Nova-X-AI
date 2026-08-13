export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "OpenRouter API key not configured." });
    }

    const { messages, model, max_tokens, temperature } = req.body;

    if (!messages || !model) {
        return res.status(400).json({ error: "Missing required fields: messages, model" });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Nova X AI"
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: max_tokens ?? 1024,
                temperature: temperature ?? 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            const detail = await response.text();
            return res.status(response.status).json({
                error: `OpenRouter request failed: ${response.status} ${response.statusText}${detail ? ` — ${detail}` : ""}`
            });
        }

        const json = await response.json();
        return res.status(200).json(json);
    } catch (error) {
        return res.status(500).json({
            error: error instanceof Error ? error.message : "Internal server error"
        });
    }
}
