import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const apiProxyPlugin = {
    name: "api-proxy",
    configureServer(server) {
        server.middlewares.use("/api/ai/chat", async (req, res) => {
            if (req.method !== "POST") {
                res.statusCode = 405;
                res.end("Method not allowed");
                return;
            }

            const env = loadEnv("development", process.cwd(), "");
            const apiKey = env.OPENROUTER_API_KEY;
            if (!apiKey) {
                res.statusCode = 500;
                res.end("OpenRouter API key not configured.");
                return;
            }

            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", async () => {
                try {
                    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                            "HTTP-Referer": "http://localhost:5173",
                            "X-Title": "Nova X AI"
                        },
                        body
                    });

                    const data = await response.json();
                    res.statusCode = response.status;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(data));
                } catch {
                    res.statusCode = 500;
                    res.end("Internal server error");
                }
            });
        });
    }
};

export default defineConfig({
    plugins: [react(), apiProxyPlugin],
    server: {
        port: 5173,
        strictPort: true
    },
    resolve: {
        alias: {
            "@nova-x-ai/core": path.resolve(__dirname, "engines/core/src"),
            "@nova-x-ai/storage": path.resolve(__dirname, "engines/storage/src"),
            "@nova-x-ai/security": path.resolve(__dirname, "engines/security/src"),
            "@nova-x-ai/ai-router": path.resolve(__dirname, "engines/ai-router/src"),
            "@nova-x-ai/image": path.resolve(__dirname, "engines/image/src"),
            "@nova-x-ai/conversation": path.resolve(__dirname, "engines/conversation/src"),
            "@nova-x-ai/character": path.resolve(__dirname, "engines/character/src")
        }
    }
});
