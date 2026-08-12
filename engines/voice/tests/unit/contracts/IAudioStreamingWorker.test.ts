import { describe, it, expect } from "vitest";
import { AudioStreamingWorker } from "../../../src/Infrastructure/Workers/AudioStreamingWorker";
import type { IAudioStreamingWorker, WorkerHealthReport, StreamRequest, StreamHandle, WorkerContext } from "../../../src/Contracts/IAudioStreamingWorker";

describe("IAudioStreamingWorker", () => {
    it("AudioStreamingWorker implements IAudioStreamingWorker", () => {
        const worker = new AudioStreamingWorker();
        expect(worker).toBeInstanceOf(AudioStreamingWorker);
        expect(worker.workerName).toBeDefined();
        expect(typeof worker.setEngine).toBe("function");
        expect(typeof worker.setVoiceId).toBe("function");
        expect(typeof worker.configure).toBe("function");
        expect(typeof worker.start).toBe("function");
        expect(typeof worker.stop).toBe("function");
        expect(typeof worker.pause).toBe("function");
        expect(typeof worker.resume).toBe("function");
        expect(typeof worker.isRunning).toBe("function");
        expect(typeof worker.enqueueStream).toBe("function");
        expect(typeof worker.cancelStream).toBe("function");
        expect(typeof worker.getHealth).toBe("function");
    });

    it("WorkerHealthReport has required fields", () => {
        const report: WorkerHealthReport = {
            workerName: "streaming",
            isRunning: true,
            lastTickDurationMs: 10,
            failureCount: 0,
            status: "healthy"
        };
        expect(report.workerName).toBe("streaming");
        expect(report.status).toBe("healthy");
    });

    it("WorkerHealthReport supports optional lastError", () => {
        const report: WorkerHealthReport = {
            workerName: "streaming",
            isRunning: false,
            lastTickDurationMs: 100,
            failureCount: 1,
            lastError: "timeout",
            status: "degraded"
        };
        expect(report.lastError).toBe("timeout");
        expect(report.status).toBe("degraded");
    });

    it("StreamRequest has required readonly fields", () => {
        const req: StreamRequest = {
            streamId: "s1",
            text: "hello",
            voiceProfileId: "p1",
            providerId: "d1",
            correlationId: "c1",
            causationId: "caus-1"
        };
        expect(req.streamId).toBe("s1");
    });

    it("StreamHandle has audioChunkIterator", () => {
        const handle: StreamHandle = {
            streamId: "s1",
            audioChunkIterator: (async function* () {})()
        };
        expect(handle.streamId).toBe("s1");
    });

    it("WorkerContext has engine, voiceId, and config", () => {
        const ctx: WorkerContext = {
            engine: {} as any,
            voiceId: {} as any,
            config: {
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
        };
        expect(ctx.engine).toBeDefined();
        expect(ctx.voiceId).toBeDefined();
        expect(ctx.config.maxConcurrentStreams).toBe(4);
    });
});
