import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AudioStreamingWorker } from "../../../src/Infrastructure/Workers/AudioStreamingWorker";
import type { IVoiceEngine } from "../../../src/Contracts/IVoiceEngine";
import type { RuntimeConfiguration } from "../../../src/Contracts/Runtime";
import { AudioChunk } from "../../../src/Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../../src/Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../../src/Domain/ValueObjects/AudioCodec";
import { VoiceId } from "../../../src/Domain/ValueObjects/VoiceId";

const makeEngine = (): IVoiceEngine => ({
    getProviderHealth: vi.fn(),
    synthesizeSpeech: vi.fn(),
    getVoiceSession: vi.fn(),
    getVoiceProfile: vi.fn(),
    listVoiceProfiles: vi.fn(),
    updateVoiceProfile: vi.fn(),
    deleteVoiceProfile: vi.fn(),
    scheduleVoiceTask: vi.fn(),
    retryUtterance: vi.fn(),
    interrupt: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    cancelStream: vi.fn(),
    getAudioStream: vi.fn(),
    getSynthesisStatus: vi.fn(),
    getProviderHealthReport: vi.fn(),
    getAudioCache: vi.fn(),
    regenerateAudio: vi.fn(),
    initialize: vi.fn(),
    getHealth: vi.fn(),
    getState: vi.fn()
} as unknown as IVoiceEngine);

const makeConfig = (): RuntimeConfiguration => ({
    maxConcurrentStreams: 8,
    chunkSizeBytes: 4096,
    maxAudioBitrateKbps: 128,
    maxInputCharacters: 2048,
    synthesisTimeoutMs: 5000,
    providerTimeoutMs: 3000,
    audioRingBufferBytes: 64 * 1024 * 1024,
    timeToFirstAudioSoftMs: 200,
    timeToFirstAudioHardMs: 500,
    maxConsecutiveFailures: 3,
    recoveryTimeoutMs: 10000,
    schedulerIntervalMs: 1000,
    maxScheduledTasks: 100,
    cleanupIntervalMs: 60000,
    projectionSyncIntervalMs: 5000,
    enableFreeFirstProvider: true,
    maxRetries: 3,
    retryBackoffMs: 1000,
    maxRetryBackoffMs: 10000
});

describe("AudioStreamingWorker", () => {
    let worker: AudioStreamingWorker;
    let mockEngine: IVoiceEngine;
    let mockConfig: RuntimeConfiguration;

    beforeEach(() => {
        vi.useFakeTimers();
        worker = new AudioStreamingWorker();
        mockEngine = makeEngine();
        mockConfig = makeConfig();
        worker.setEngine(mockEngine);
        worker.setVoiceId(VoiceId.create("voice-1"));
        worker.configure(mockConfig);
    });

    afterEach(async () => {
        if (worker.isRunning()) {
            await worker.stop();
        }
        vi.useRealTimers();
    });

    describe("lifecycle", () => {

        it("starts successfully", async () => {
            await worker.start();
            expect(worker.isRunning()).toBe(true);
        });

        it("stops successfully", async () => {
            await worker.start();
            await worker.stop();
            expect(worker.isRunning()).toBe(false);
        });

        it("pauses successfully", async () => {
            await worker.start();
            await worker.pause();
            expect(worker.isRunning()).toBe(true);
        });

        it("resumes successfully", async () => {
            await worker.start();
            await worker.pause();
            await worker.resume();
            expect(worker.isRunning()).toBe(true);
        });

        it("throws when starting without engine", async () => {
            const workerWithoutEngine = new AudioStreamingWorker();
            workerWithoutEngine.setVoiceId(VoiceId.create("voice-1"));
            workerWithoutEngine.configure(mockConfig);
            await expect(workerWithoutEngine.start()).rejects.toThrow();
        });

        it("throws when starting without voiceId", async () => {
            const workerWithoutVoiceId = new AudioStreamingWorker();
            workerWithoutVoiceId.setEngine(mockEngine);
            workerWithoutVoiceId.configure(mockConfig);
            await expect(workerWithoutVoiceId.start()).rejects.toThrow();
        });

    });

    describe("enqueueStream", () => {

        it("returns a stream handle with an iterator", async () => {
            await worker.start();
            const handle = await worker.enqueueStream({
                streamId: "stream-1",
                text: "Hello world",
                voiceProfileId: "profile-1",
                providerId: "provider-1",
                correlationId: "corr-1",
                causationId: "caus-1"
            });
            expect(handle.streamId).toBe("stream-1");
            expect(handle.audioChunkIterator).toBeDefined();
        });

    });

    describe("cancelStream", () => {

        it("cancels an active stream", async () => {
            await worker.start();
            const handle = await worker.enqueueStream({
                streamId: "stream-1",
                text: "Hello world",
                voiceProfileId: "profile-1",
                providerId: "provider-1",
                correlationId: "corr-1",
                causationId: "caus-1"
            });
            await expect(worker.cancelStream("stream-1")).resolves.toBeUndefined();
        });

        it("does nothing for a non-existent stream", async () => {
            await worker.start();
            await expect(worker.cancelStream("non-existent")).resolves.toBeUndefined();
        });

    });

    describe("tick", () => {

        it("executes tickImpl periodically", async () => {
            await worker.start();
            vi.advanceTimersByTime(1000);
            expect(worker.isRunning()).toBe(true);
        });

    });

    describe("getHealth", () => {

        it("returns a health report", () => {
            const health = worker.getHealth();
            expect(health.workerName).toBe("AudioStreamingWorker");
            expect(health.status).toBeDefined();
        });

    });

});
