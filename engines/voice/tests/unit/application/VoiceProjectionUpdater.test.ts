import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceProjectionUpdater } from "../../../src/Application/Projections/VoiceProjectionUpdater";

describe("VoiceProjectionUpdater", () => {
    let mockEventBus: any;
    let mockProjectionStore: any;
    let updater: VoiceProjectionUpdater;

    beforeEach(() => {
        mockEventBus = {
            subscribe: vi.fn()
        };
        mockProjectionStore = {
            getProjection: vi.fn(),
            saveProjection: vi.fn()
        };
        updater = new VoiceProjectionUpdater(mockEventBus, mockProjectionStore);
    });

    it("subscribes to event types on start", () => {
        updater.start();
        expect(mockEventBus.subscribe).toHaveBeenCalledTimes(6);
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_VOICE_VoiceInitialized", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_VOICE_SynthesisStarted", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_VOICE_StreamCompleted", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_VOICE_StreamInterrupted", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_VOICE_SynthesisFailed", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_VOICE_ProviderStatusChanged", expect.any(Object));
    });

    it("does not subscribe again on second start", () => {
        updater.start();
        updater.start();
        expect(mockEventBus.subscribe).toHaveBeenCalledTimes(6);
    });

    it("returns null when no projection found", async () => {
        mockProjectionStore.getProjection = vi.fn().mockResolvedValue(null);
        const result = await updater.getVoiceReadModel("voice-1");
        expect(result).toBeNull();
        expect(mockProjectionStore.getProjection).toHaveBeenCalledWith("voice-projection-voice-1");
    });

    it("returns projection when found", async () => {
        const readModel = {
            voiceId: "voice-1",
            voiceState: "streaming",
            providerId: "provider-1",
            version: 1,
            lastRequestId: "req-1",
            totalAudioDurationMs: 5000,
            totalChunksProcessed: 10,
            consecutiveFailures: 0,
            updatedAt: 1700000000000
        };
        mockProjectionStore.getProjection = vi.fn().mockResolvedValue(readModel);
        const result = await updater.getVoiceReadModel("voice-1");
        expect(result).toEqual(readModel);
        expect(mockProjectionStore.getProjection).toHaveBeenCalledWith("voice-projection-voice-1");
    });

    it("saves projection with correct key", async () => {
        const readModel = {
            voiceId: "voice-1",
            voiceState: "streaming",
            providerId: "provider-1",
            version: 1,
            lastRequestId: "req-1",
            totalAudioDurationMs: 5000,
            totalChunksProcessed: 10,
            consecutiveFailures: 0,
            updatedAt: 1700000000000
        };
        mockProjectionStore.saveProjection = vi.fn().mockResolvedValue(undefined);
        await updater.saveVoiceReadModel("voice-1", readModel);
        expect(mockProjectionStore.saveProjection).toHaveBeenCalledWith("voice-projection-voice-1", readModel);
    });

    it("stops without error", () => {
        updater.start();
        expect(() => updater.stop()).not.toThrow();
    });
});
