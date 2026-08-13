import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
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
