import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetAudioStreamQueryHandler } from "../../../src/Application/Handlers/GetAudioStreamQueryHandler";
import { GetAudioStreamQuery } from "../../../src/Application/Queries/GetAudioStreamQuery";
import { AudioStreamDto } from "../../../src/Application/DTO/AudioStreamDto";

describe("GetAudioStreamQueryHandler", () => {
    let mockVoiceRepository: any;
    let handler: GetAudioStreamQueryHandler;

    beforeEach(() => {
        mockVoiceRepository = {};
        handler = new GetAudioStreamQueryHandler(mockVoiceRepository);
    });

    it("throws when audio stream not found", async () => {
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(null);
        const query = new GetAudioStreamQuery("stream-1", "user-1");
        await expect(handler.handle(query)).rejects.toThrow("Audio stream not found: stream-1");
        expect(mockVoiceRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("returns AudioStreamDto when stream found", async () => {
        const aggregate = {
            getStreamId: () => "stream-1",
            getVoiceId: () => "voice-1",
            getRequestId: () => "req-1",
            getProfileId: () => "profile-1",
            getProviderId: () => "provider-1",
            getText: () => "Hello",
            getStatus: () => "streaming",
            getChunks: () => [],
            getTotalBytes: () => 0,
            getCreatedAt: () => 1700000000000,
            getCompletedAt: () => null
        };
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(aggregate);
        const query = new GetAudioStreamQuery("stream-1", "user-1");
        const result = await handler.handle(query);
        expect(result).toBeInstanceOf(AudioStreamDto);
        expect(result.streamId).toBe("stream-1");
        expect(mockVoiceRepository.findById).toHaveBeenCalledTimes(1);
    });
});
