import { describe, it, expect } from "vitest";
import { VoiceEngine } from "../../../src/Infrastructure/VoiceEngine";
import type { IVoiceEngine } from "../../../src/Contracts/IVoiceEngine";

describe("IVoiceEngine", () => {
    it("VoiceEngine implements IVoiceEngine shape", () => {
        const source = VoiceEngine.prototype;

        expect(typeof source.initialize).toBe("function");
        expect(typeof source.shutdown).toBe("function");
        expect(typeof source.synthesizeSpeech).toBe("function");
        expect(typeof source.interrupt).toBe("function");
        expect(typeof source.pause).toBe("function");
        expect(typeof source.resume).toBe("function");
        expect(typeof source.cancelStream).toBe("function");
        expect(typeof source.regenerateAudio).toBe("function");
        expect(typeof source.retryUtterance).toBe("function");
        expect(typeof source.createVoiceProfile).toBe("function");
        expect(typeof source.updateVoiceProfile).toBe("function");
        expect(typeof source.deleteVoiceProfile).toBe("function");
        expect(typeof source.scheduleVoiceTask).toBe("function");
        expect(typeof source.getVoiceProfile).toBe("function");
        expect(typeof source.getVoiceSession).toBe("function");
        expect(typeof source.getAudioStream).toBe("function");
        expect(typeof source.listVoiceProfiles).toBe("function");
        expect(typeof source.getSynthesisStatus).toBe("function");
        expect(typeof source.getProviderHealth).toBe("function");
        expect(typeof source.getAudioCache).toBe("function");
        expect(typeof source.takeSnapshot).toBe("function");
    });

    it("VoiceEngine constructor accepts all required dependencies", () => {
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

    it("interface declares readonly properties on VoiceEngine instance", () => {
        const engine = new VoiceEngine(
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

        expect(engine.eventBus).toBeDefined();
        expect(engine.voiceRepository).toBeDefined();
        expect(engine.sessionRepository).toBeDefined();
        expect(engine.profileRepository).toBeDefined();
        expect(engine.eventStoreRepository).toBeDefined();
        expect(engine.scheduledTaskRepository).toBeDefined();
        expect(engine.timeSimulationService).toBeDefined();
        expect(engine.audioCompressionService).toBeDefined();
        expect(engine.voiceCacheService).toBeDefined();
        expect(engine.multiSpeakerCoordinator).toBeDefined();
    });
});
