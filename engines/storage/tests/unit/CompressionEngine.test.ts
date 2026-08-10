import { describe, it, expect } from "vitest";
import { CompressionEngine } from "../../src/Infrastructure/Persistence/CompressionEngine.ts";

describe("CompressionEngine", () => {
    it("should compress and decompress data", async () => {
        const engine = new CompressionEngine();
        const data = new TextEncoder().encode("hello world").buffer;
        const compressed = await engine.compress(data);
        expect(compressed.algorithm).toBe("base64");
        const decompressed = await engine.decompress(compressed.data, compressed.algorithm);
        const text = new TextDecoder().decode(decompressed);
        expect(text).toBe("hello world");
    });
});
