import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetAudioCacheQueryHandler } from "../../../src/Application/Handlers/GetAudioCacheQueryHandler";
import { GetAudioCacheQuery } from "../../../src/Application/Queries/GetAudioCacheQuery";
import { AudioCacheDto } from "../../../src/Application/DTO/AudioCacheDto";

describe("GetAudioCacheQueryHandler", () => {
    let mockVoiceRepository: any;
    let handler: GetAudioCacheQueryHandler;

    beforeEach(() => {
        mockVoiceRepository = {};
        handler = new GetAudioCacheQueryHandler(mockVoiceRepository);
    });

    it("returns empty cache when aggregate not found", async () => {
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(null);
        const query = new GetAudioCacheQuery("voice-1", "user-1");
        const result = await handler.handle(query);
        expect(result).toBeInstanceOf(AudioCacheDto);
        expect(result.voiceId).toBe("voice-1");
        expect(result.cachedItems).toBe(0);
        expect(result.totalBytes).toBe(0);
        expect(result.oldestCachedAt).toBeNull();
    });

    it("returns cache info when aggregate found", async () => {
        const aggregate = {
            getTotalChunksProcessed: () => 10
        };
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(aggregate);
        const query = new GetAudioCacheQuery("voice-1", "user-1");
        const result = await handler.handle(query);
        expect(result).toBeInstanceOf(AudioCacheDto);
        expect(result.voiceId).toBe("voice-1");
        expect(result.cachedItems).toBe(10);
        expect(result.totalBytes).toBe(0);
        expect(result.oldestCachedAt).not.toBeNull();
    });
});
