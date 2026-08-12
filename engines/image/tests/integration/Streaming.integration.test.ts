import { describe, it, expect } from "vitest";
import { ImageId } from "../../src/Domain/ValueObjects/ImageId";
import { FakeImageProviderAdapter } from "../../src/Infrastructure/Adapters/FakeImageProviderAdapter";
import { StreamingPolicy } from "../../src/Domain/Policies/StreamingPolicy";
import { ImageThumbnailGenerator } from "../../src/Domain/Services/ImageEngineServices";
import { ImageCompressionEngine } from "../../src/Domain/Services/ImageEngineServices";
import { ImageFormat } from "../../src/Domain/ValueObjects/ImageFormat";

describe("Streaming.integration", () => {
    it("should stream chunks from provider", async () => {
        const provider = new FakeImageProviderAdapter();
        const result = await provider.executeGeneration({
            imageId: "img-1",
            prompt: "test",
            negativePrompt: "",
            mode: "textToImage",
            width: 1024,
            height: 1024,
            candidateCount: 1,
            seed: 123,
            steps: 20,
            cfgScale: 7.0,
            visualTags: [],
            styleTokens: [],
            environmentalModifiers: []
        });
        expect(result.success).toBe(true);
        expect(result.candidates).toHaveLength(1);
    });

    it("should respect streaming policy limits", () => {
        const policy = new StreamingPolicy(65536, 10);
        expect(policy.canStream(5)).toBe(true);
        expect(policy.canStream(10)).toBe(false);
        expect(policy.getMaxChunkSize()).toBe(65536);
    });

    it("should compress streamed data", () => {
        const engine = new ImageCompressionEngine();
        const input = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]).buffer;
        const compressed = engine.compress(input, ImageFormat.WEBP, 0.8);
        expect(compressed.byteLength).toBeGreaterThan(0);
    });

    it("should generate thumbnails during streaming", () => {
        const generator = new ImageThumbnailGenerator();
        const data = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]).buffer;
        const thumb = generator.generate(data, { width: 64, height: 64 });
        expect(thumb.byteLength).toBeGreaterThan(0);
    });

    it("should handle back-pressure with policy", () => {
        const policy = new StreamingPolicy(1024, 2);
        expect(policy.canStream(0)).toBe(true);
        expect(policy.canStream(1)).toBe(true);
        expect(policy.canStream(2)).toBe(false);
    });

    it("should handle full lifecycle in streaming mode", async () => {
        const provider = new FakeImageProviderAdapter();
        provider.setLatencyMs(10);

        const imageId = ImageId.create();

        const result = await provider.executeGeneration({
            imageId: imageId.getValue(),
            prompt: "streaming test",
            negativePrompt: "",
            mode: "textToImage",
            width: 512,
            height: 512,
            candidateCount: 1,
            seed: 456,
            steps: 20,
            cfgScale: 7.0,
            visualTags: [],
            styleTokens: [],
            environmentalModifiers: []
        });

        expect(result.latencyMs).toBeLessThan(100);
        expect(result.candidates[0].score).toBeGreaterThan(0);
    });
});
