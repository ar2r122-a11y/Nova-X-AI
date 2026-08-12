import { describe, it, expect } from "vitest";
import { VoiceEngine } from "../../../src/Infrastructure/VoiceEngine";

describe("AiRouterBoundary", () => {
    it("VoiceEngine does not import or reference vendor provider APIs directly", () => {
        const fs = require("fs");
        const path = require("path");
        const sourcePath = path.resolve(__dirname, "../../../src/Infrastructure/VoiceEngine.ts");
        const content = fs.readFileSync(sourcePath, "utf-8");

        const vendorPatterns = [
            "openai", "elevenlabs", "azure", "google", "amazon", "polly",
            "google-cloud", "speech-to-text", "text-to-speech", "stt", "tts"
        ];

        for (const pattern of vendorPatterns) {
            expect(content.toLowerCase()).not.toContain(pattern.toLowerCase());
        }
    });

    it("VoiceEngine does not directly access network sockets or HTTP clients", () => {
        const fs = require("fs");
        const path = require("path");
        const sourcePath = path.resolve(__dirname, "../../../src/Infrastructure/VoiceEngine.ts");
        const content = fs.readFileSync(sourcePath, "utf-8");

        expect(content).not.toContain("fetch(");
        expect(content).not.toContain("http.");
        expect(content).not.toContain("https.");
        expect(content).not.toContain("axios");
        expect(content).not.toContain("WebSocket");
    });

    it("VoiceEngine can be constructed without vendor dependencies", () => {
        expect(() => {
            new VoiceEngine(
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any,
                {} as any
            );
        }).not.toThrow();
    });
});
