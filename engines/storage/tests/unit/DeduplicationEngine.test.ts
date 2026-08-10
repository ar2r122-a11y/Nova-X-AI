import { describe, it, expect, vi } from "vitest";
import { DeduplicationEngine } from "../../src/Infrastructure/Persistence/DeduplicationEngine.ts";

describe("DeduplicationEngine", () => {
    it("should compute fingerprint", async () => {
        const engine = new DeduplicationEngine();
        const fp = await engine.computeFingerprint(new ArrayBuffer(8));
        expect(fp).toHaveLength(64);
    });

    it("should detect duplicates", async () => {
        const engine = new DeduplicationEngine();
        const fp = await engine.computeFingerprint(new ArrayBuffer(8));
        await engine.recordFingerprint(fp);
        expect(await engine.isDuplicate(fp)).toBe(true);
    });
});
