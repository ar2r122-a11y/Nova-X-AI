import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceRuntimeImpl } from "../../src/Infrastructure/Runtime/VoiceRuntimeImpl";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import type { IVoiceEngine } from "../../src/Contracts/IVoiceEngine";
import type { RuntimeConfiguration, VoiceRuntimeState } from "../../src/Contracts/Runtime";

describe("VoiceRuntimeImpl", () => {
    let mockEngine: IVoiceEngine;
    let mockEventBus: any;
    let config: RuntimeConfiguration;
    let runtime: VoiceRuntimeImpl;

    beforeEach(() => {
        mockEngine = {
            eventBus: {} as any,
            voiceRepository: {} as any,
            sessionRepository: {} as any,
            profileRepository: {} as any,
            eventStoreRepository: {} as any,
            scheduledTaskRepository: {} as any,
            timeSimulationService: {} as any,
            audioCompressionService: {} as any,
            voiceCacheService: {} as any,
            multiSpeakerCoordinator: {} as any,
            initialize: vi.fn().mockResolvedValue(undefined),
            shutdown: vi.fn().mockResolvedValue(undefined),
            takeSnapshot: vi.fn().mockResolvedValue({}),
            synthesizeSpeech: vi.fn(),
            interrupt: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
            cancelStream: vi.fn(),
            regenerateAudio: vi.fn(),
            retryUtterance: vi.fn(),
            createVoiceProfile: vi.fn(),
            updateVoiceProfile: vi.fn(),
            deleteVoiceProfile: vi.fn(),
            scheduleVoiceTask: vi.fn(),
            getVoiceProfile: vi.fn(),
            getVoiceSession: vi.fn(),
            getAudioStream: vi.fn(),
            listVoiceProfiles: vi.fn(),
            getSynthesisStatus: vi.fn(),
            getProviderHealth: vi.fn(),
            getAudioCache: vi.fn()
        } as unknown as IVoiceEngine;

        mockEventBus = {};
        config = {
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

        runtime = new VoiceRuntimeImpl(mockEngine, mockEventBus, config);
    });

    describe("start", () => {
        it("transitions state from initialized to waiting_for_input", async () => {
            await runtime.start("voice-1");

            expect(runtime.getState()).toBe("waiting_for_input");
        });

        it("records startedAt", async () => {
            await runtime.start("voice-1");

            expect(runtime.getUptimeMs()).toBeGreaterThanOrEqual(0);
        });

        it("initializes workers and health checks", async () => {
            await runtime.start("voice-1");

            expect(runtime.getWorkers().length).toBeGreaterThan(0);
            expect(runtime.getHealthChecks().length).toBeGreaterThan(0);
        });
    });

    describe("stop", () => {
        it("throws on invalid state transition to completed", async () => {
            await runtime.start("voice-1");
            await runtime.transitionTo("synthesizing");

            await expect(runtime.stop("voice-1")).rejects.toThrow("Invalid runtime state transition");
        });
    });

    describe("pause and resume", () => {
        it("transitions to paused", async () => {
            await runtime.start("voice-1");
            await runtime.pause();

            expect(runtime.getState()).toBe("paused");
        });

        it("transitions back to waiting_for_input on resume", async () => {
            await runtime.start("voice-1");
            await runtime.pause();
            await runtime.resume();

            expect(runtime.getState()).toBe("waiting_for_input");
        });
    });

    describe("transitionTo", () => {
        it("throws on invalid transition", async () => {
            await runtime.start("voice-1");

            await expect(runtime.transitionTo("completed" as VoiceRuntimeState)).rejects.toThrow("Invalid runtime state transition");
        });

        it("allows valid transition", async () => {
            await runtime.start("voice-1");
            await runtime.transitionTo("synthesizing");

            expect(runtime.getState()).toBe("synthesizing");
        });
    });

    describe("handleFailure", () => {
        it("transitions to failed when in synthesizing state", async () => {
            await runtime.start("voice-1");
            await runtime.transitionTo("synthesizing");
            await runtime.handleFailure("test", "voice-1");

            expect(runtime.getState()).toBe("failed");
        });
    });

    describe("recover", () => {
        it("reinitializes voice and transitions to waiting_for_input", async () => {
            await runtime.start("voice-1");
            await runtime.transitionTo("synthesizing");
            await runtime.handleFailure("test", "voice-1");
            await runtime.recover("voice-1");

            expect(runtime.getState()).toBe("waiting_for_input");
            expect(mockEngine.initialize).toHaveBeenCalledWith("voice-1");
        });
    });

    describe("takeSnapshot", () => {
        it("returns snapshot via engine when not completed", async () => {
            await runtime.start("voice-1");
            const snapshot = await runtime.takeSnapshot("voice-1");

            expect(mockEngine.takeSnapshot).toHaveBeenCalledWith("voice-1");
            expect(snapshot).toEqual({});
        });
    });
});
