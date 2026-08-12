import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetSynthesisStatusQueryHandler } from "../../../src/Application/Handlers/GetSynthesisStatusQueryHandler";
import { GetSynthesisStatusQuery } from "../../../src/Application/Queries/GetSynthesisStatusQuery";
import { VoiceSynthesisResultDto } from "../../../src/Application/DTO/VoiceSynthesisResultDto";

describe("GetSynthesisStatusQueryHandler", () => {
    let mockVoiceRepository: any;
    let handler: GetSynthesisStatusQueryHandler;

    beforeEach(() => {
        mockVoiceRepository = {};
        handler = new GetSynthesisStatusQueryHandler(mockVoiceRepository);
    });

    it("throws when voice not found", async () => {
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(null);
        const query = new GetSynthesisStatusQuery("voice-1", "req-1", "user-1");
        await expect(handler.handle(query)).rejects.toThrow("Voice not found: voice-1");
        expect(mockVoiceRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("returns VoiceSynthesisResultDto when voice found", async () => {
        const aggregate = {
            getLastRequestId: () => "req-1",
            getVoiceId: () => ({ getValue: () => "voice-1" }),
            getVoiceState: () => ({ getValue: () => "streaming" }),
            getTotalAudioDurationMs: () => 5000,
            getTotalChunksProcessed: () => 10,
            getProviderId: () => ({ getValue: () => "provider-1" }),
            getLastProviderHealth: () => ({ getEstimatedCostMicros: () => 150000 })
        };
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(aggregate);
        const query = new GetSynthesisStatusQuery("voice-1", "req-1", "user-1");
        const result = await handler.handle(query);
        expect(result).toBeInstanceOf(VoiceSynthesisResultDto);
        expect(result.requestId).toBe("req-1");
        expect(result.voiceId).toBe("voice-1");
        expect(result.status).toBe("streaming");
        expect(result.durationMs).toBe(5000);
        expect(result.totalChunks).toBe(10);
        expect(result.providerId).toBe("provider-1");
        expect(result.estimatedCostMicros).toBe(150000);
        expect(mockVoiceRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("returns empty requestId when aggregate has no last request", async () => {
        const aggregate = {
            getLastRequestId: () => null,
            getVoiceId: () => ({ getValue: () => "voice-1" }),
            getVoiceState: () => ({ getValue: () => "idle" }),
            getTotalAudioDurationMs: () => 0,
            getTotalChunksProcessed: () => 0,
            getProviderId: () => ({ getValue: () => "provider-1" }),
            getLastProviderHealth: () => ({ getEstimatedCostMicros: () => 0 })
        };
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(aggregate);
        const query = new GetSynthesisStatusQuery("voice-1", "req-1", "user-1");
        const result = await handler.handle(query);
        expect(result.requestId).toBe("");
    });
});
