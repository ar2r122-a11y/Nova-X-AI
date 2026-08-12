import { describe, it, expect } from "vitest";
import { VoiceRuntimeImpl } from "../../../src/Infrastructure/Runtime/VoiceRuntimeImpl";
import type { IVoiceRuntime } from "../../../src/Contracts/Runtime/IVoiceRuntime";
import type { RuntimeConfiguration, VoiceRuntimeState } from "../../../src/Contracts/Runtime";

describe("IVoiceRuntime", () => {
    it("VoiceRuntimeImpl implements IVoiceRuntime shape", () => {
        const runtime = new VoiceRuntimeImpl(
            {} as any,
            {} as any,
            {
                synthesisTimeoutMs: 5000,
                providerTimeoutMs: 2000,
                maxConcurrentStreams: 4,
                audioRingBufferBytes: 4096,
                maxAudioBitrateKbps: 128,
                maxInputCharacters: 1000,
                chunkSizeBytes: 1024,
                timeToFirstAudioSoftMs: 300,
                timeToFirstAudioHardMs: 1000,
                maxConsecutiveFailures: 3,
                recoveryTimeoutMs: 5000,
                schedulerIntervalMs: 1000,
                maxScheduledTasks: 100,
                cleanupIntervalMs: 60000,
                projectionSyncIntervalMs: 5000,
                enableFreeFirstProvider: true,
                maxRetries: 3,
                retryBackoffMs: 1000,
                maxRetryBackoffMs: 30000
            }
        );

        expect(runtime.engine).toBeDefined();
        expect(runtime.configuration).toBeDefined();
        expect(runtime.currentRuntimeState).toBeDefined();
        expect(typeof runtime.start).toBe("function");
        expect(typeof runtime.stop).toBe("function");
        expect(typeof runtime.pause).toBe("function");
        expect(typeof runtime.resume).toBe("function");
        expect(typeof runtime.transitionTo).toBe("function");
        expect(typeof runtime.handleFailure).toBe("function");
        expect(typeof runtime.recover).toBe("function");
        expect(typeof runtime.takeSnapshot).toBe("function");
        expect(typeof runtime.getState).toBe("function");
        expect(typeof runtime.getUptimeMs).toBe("function");
        expect(typeof runtime.getWorkers).toBe("function");
        expect(typeof runtime.getHealthChecks).toBe("function");
    });

    it("RuntimeConfiguration has required fields", () => {
        const config: RuntimeConfiguration = {
            synthesisTimeoutMs: 5000,
            providerTimeoutMs: 2000,
            maxConcurrentStreams: 4,
            audioRingBufferBytes: 4096,
            maxAudioBitrateKbps: 128,
            maxInputCharacters: 1000,
            chunkSizeBytes: 1024,
            timeToFirstAudioSoftMs: 300,
            timeToFirstAudioHardMs: 1000,
            maxConsecutiveFailures: 3,
            recoveryTimeoutMs: 5000,
            schedulerIntervalMs: 1000,
            maxScheduledTasks: 100,
            cleanupIntervalMs: 60000,
            projectionSyncIntervalMs: 5000,
            enableFreeFirstProvider: true,
            maxRetries: 3,
            retryBackoffMs: 1000,
            maxRetryBackoffMs: 30000
        };
        expect(config.maxConcurrentStreams).toBe(4);
        expect(config.chunkSizeBytes).toBe(1024);
    });

    it("VoiceRuntimeState covers all expected values", () => {
        const states: VoiceRuntimeState[] = [
            "initialized", "waiting_for_input", "synthesizing", "streaming_audio",
            "buffering", "awaiting_stt", "processing_transcription", "completed",
            "paused", "failed", "recovering"
        ];
        states.forEach(s => expect(typeof s).toBe("string"));
    });
});
