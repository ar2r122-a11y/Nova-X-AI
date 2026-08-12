import { describe, it, expect } from "vitest";
import { AudioCacheDto } from "../../../src/Application/DTO/AudioCacheDto";

describe("AudioCacheDto", () => {
    it("creates with all properties", () => {
        const dto = new AudioCacheDto("voice-1", 10, 40960, 1700000000000);
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.cachedItems).toBe(10);
        expect(dto.totalBytes).toBe(40960);
        expect(dto.oldestCachedAt).toBe(1700000000000);
    });

    it("creates with null oldestCachedAt", () => {
        const dto = new AudioCacheDto("voice-1", 0, 0, null);
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.cachedItems).toBe(0);
        expect(dto.totalBytes).toBe(0);
        expect(dto.oldestCachedAt).toBeNull();
    });

    it("creates with empty cache", () => {
        const dto = new AudioCacheDto("voice-1", 0, 0, null);
        expect(dto.cachedItems).toBe(0);
        expect(dto.totalBytes).toBe(0);
    });
});
