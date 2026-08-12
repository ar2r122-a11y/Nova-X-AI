import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceRecoveryWorker } from "../../../src/Infrastructure/Workers/VoiceRecoveryWorker";
import type { IVoiceEngine } from "../../../src/Contracts/IVoiceEngine";
import { VoiceId } from "../../../src/Domain/ValueObjects/VoiceId";
import type { RuntimeConfiguration } from "../../../src/Contracts/Runtime";

describe("VoiceRecoveryWorker", () => {
    let worker: VoiceRecoveryWorker;
    let mockEngine: Partial<IVoiceEngine>;

    beforeEach(() => {
        worker = new VoiceRecoveryWorker();
        mockEngine = {
            initialize: vi.fn().mockResolvedValue(undefined)
        };
    });

    describe("constructor", () => {

        it("is instantiable", () => {
            expect(worker).toBeInstanceOf(VoiceRecoveryWorker);
        });

    });

    describe("recover", () => {

        it("throws when engine is not configured", async () => {
            await expect(worker.recover("session-1", "network error")).rejects.toThrow("VoiceRecoveryWorker not configured with engine.");
        });

        it("calls engine.initialize with the sessionId", async () => {
            worker.setEngine(mockEngine as IVoiceEngine);
            await worker.recover("session-1", "network error");
            expect(mockEngine.initialize).toHaveBeenCalledWith("session-1");
        });

        it("resolves when recovery succeeds", async () => {
            worker.setEngine(mockEngine as IVoiceEngine);
            await expect(worker.recover("session-1", "reason")).resolves.toBeUndefined();
        });

    });

    describe("setEngine", () => {

        it("sets the engine reference", () => {
            worker.setEngine(mockEngine as IVoiceEngine);
            expect((worker as any).engine).toBe(mockEngine);
        });

    });

    describe("configure", () => {

        it("sets the configuration", () => {
            const config: RuntimeConfiguration = {
                synthesisTimeoutMs: 5000,
                providerTimeoutMs: 3000,
                maxConcurrentStreams: 4,
                audioRingBufferBytes: 1024,
                maxAudioBitrateKbps: 128,
                maxInputCharacters: 1000,
                chunkSizeBytes: 512,
                timeToFirstAudioSoftMs: 200,
                timeToFirstAudioHardMs: 500,
                maxConsecutiveFailures: 3,
                recoveryTimeoutMs: 1000,
                schedulerIntervalMs: 60000,
                maxScheduledTasks: 100,
                cleanupIntervalMs: 300000,
                projectionSyncIntervalMs: 5000,
                enableFreeFirstProvider: false,
                maxRetries: 3,
                retryBackoffMs: 1000,
                maxRetryBackoffMs: 10000
            };
            worker.configure(config);
            expect((worker as any).config).toBe(config);
        });

    });

    describe("lifecycle", () => {

        it("start throws when engine is missing", async () => {
            await expect(worker.start()).rejects.toThrow("VoiceRecoveryWorker requires engine and voiceId before start.");
        });

        it("start throws when voiceId is missing", async () => {
            worker.setEngine(mockEngine as IVoiceEngine);
            await expect(worker.start()).rejects.toThrow("VoiceRecoveryWorker requires engine and voiceId before start.");
        });

        it("start succeeds with engine and voiceId", async () => {
            worker.setEngine(mockEngine as IVoiceEngine);
            worker.setVoiceId(VoiceId.create("voice-1"));
            await expect(worker.start()).resolves.toBeUndefined();
            expect(worker.isRunning()).toBe(true);
        });

        it("stop stops the worker", async () => {
            worker.setEngine(mockEngine as IVoiceEngine);
            worker.setVoiceId(VoiceId.create("voice-1"));
            await worker.start();
            await worker.stop();
            expect(worker.isRunning()).toBe(false);
        });

        it("pause and resume toggle paused state", async () => {
            worker.setEngine(mockEngine as IVoiceEngine);
            worker.setVoiceId(VoiceId.create("voice-1"));
            await worker.start();
            await worker.pause();
            expect((worker as any).paused).toBe(true);
            await worker.resume();
            expect((worker as any).paused).toBe(false);
            await worker.stop();
        });

    });

    describe("tickImpl", () => {

        it("resolves immediately", async () => {
            const result = await (worker as any).tickImpl();
            expect(result).toBeUndefined();
        });

    });

    describe("getHealth", () => {

        it("returns health report", () => {
            const health = worker.getHealth();
            expect(health.workerName).toBe("VoiceRecoveryWorker");
            expect(health.isRunning).toBe(false);
            expect(health.failureCount).toBe(0);
            expect(health.status).toBe("unhealthy");
        });

        it("returns healthy when running with no failures", async () => {
            worker.setEngine(mockEngine as IVoiceEngine);
            worker.setVoiceId(VoiceId.create("voice-1"));
            await worker.start();
            const health = worker.getHealth();
            expect(health.status).toBe("healthy");
            await worker.stop();
        });

    });

});
