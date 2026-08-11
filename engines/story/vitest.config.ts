import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@nova-x-ai/core": resolve(__dirname, "../../core/src"),
            "@nova-x-ai/storage": resolve(__dirname, "../../storage/src"),
        },
    },
    test: {
        globals: true,
        environment: "node",
        include: ["tests/**/*.test.ts"],
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: ["src/index.ts"]
        }
    }
});
