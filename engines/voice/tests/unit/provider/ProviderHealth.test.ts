import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceHealthCheck } from "../../../src/Infrastructure/Health/VoiceHealthCheck";
import type { IVoiceEngine } from "../../../src/Contracts/IVoiceEngine";
import type { IAudioStreamingWorker, WorkerHealthReport } from "../../../src/Contracts/IAudioStreamingWorker";

const makeWorker = (overrides: Partial<WorkerHealthReport> = {}): IAudioStreamingWorker => ({
    workerName: "AudioStreamingWorker",
    isRunning: true,
    lastTickDurationMs: 10,
    failureCount: 0,
    lastError: undefined,
    status: "healthy",
    ...overrides,
    setEngine: vi.fn(),
    setVoiceId: vi.fn(),
    configure: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getHealth: vi.fn().mockReturnValue({
        workerName: overrides.workerName ?? "AudioStreamingWorker",
        isRunning: overrides.isRunning ?? true,
        lastTickDurationMs: overrides.lastTickDurationMs ?? 10,
        failureCount: overrides.failureCount ?? 0,
        lastError: overrides.lastError,
        status: overrides.status ?? "healthy"
    }),
    enqueueStream: vi.fn(),
    cancelStream: vi.fn()
} as unknown as IAudioStreamingWorker);

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

describe("ProviderHealth (VoiceHealthCheck)", () => {
    let healthCheck: VoiceHealthCheck;
    let mockEngine: IVoiceEngine;

    beforeEach(() => {
        mockEngine = makeEngine();
        healthCheck = new VoiceHealthCheck(mockEngine, []);
    });

    describe("check", () => {

        it("returns healthy when all workers are healthy", async () => {
            const workers = [
                makeWorker({ workerName: "Worker1", status: "healthy" }),
                makeWorker({ workerName: "Worker2", status: "healthy" })
            ];
            healthCheck = new VoiceHealthCheck(mockEngine, workers);
            const report = await healthCheck.check();
            expect(report.status).toBe("healthy");
        });

        it("returns degraded when at least one worker is degraded", async () => {
            const workers = [
                makeWorker({ workerName: "Worker1", status: "healthy" }),
                makeWorker({ workerName: "Worker2", status: "degraded", failureCount: 2 })
            ];
            healthCheck = new VoiceHealthCheck(mockEngine, workers);
            const report = await healthCheck.check();
            expect(report.status).toBe("degraded");
        });

        it("returns unhealthy when at least one worker is unhealthy", async () => {
            const workers = [
                makeWorker({ workerName: "Worker1", status: "unhealthy", failureCount: 5 })
            ];
            healthCheck = new VoiceHealthCheck(mockEngine, workers);
            const report = await healthCheck.check();
            expect(report.status).toBe("unhealthy");
        });

        it("returns degraded when one worker is degraded and another is unhealthy", async () => {
            const workers = [
                makeWorker({ workerName: "Worker1", status: "degraded", failureCount: 2 }),
                makeWorker({ workerName: "Worker2", status: "unhealthy", failureCount: 5 })
            ];
            healthCheck = new VoiceHealthCheck(mockEngine, workers);
            const report = await healthCheck.check();
            expect(report.status).toBe("degraded");
        });

        it("includes worker reports in the output", async () => {
            const workers = [
                makeWorker({ workerName: "Worker1", status: "healthy", lastTickDurationMs: 15 })
            ];
            healthCheck = new VoiceHealthCheck(mockEngine, workers);
            const report = await healthCheck.check();
            expect(report.workers.length).toBe(1);
            expect((report.workers[0] as any).workerName).toBe("Worker1");
            expect((report.workers[0] as any).lastTickDurationMs).toBe(15);
        });

        it("includes checks with correct properties", async () => {
            const workers = [
                makeWorker({ workerName: "Worker1", status: "healthy", lastTickDurationMs: 10, failureCount: 0 })
            ];
            healthCheck = new VoiceHealthCheck(mockEngine, workers);
            const report = await healthCheck.check();
            expect(report.checks.length).toBe(1);
            expect(report.checks[0].name).toBe("Worker1");
            expect(report.checks[0].healthy).toBe(true);
            expect(report.checks[0].durationMs).toBe(10);
        });

        it("sets a timestamp on the report", async () => {
            const before = Date.now();
            const report = await healthCheck.check();
            const after = Date.now();
            expect(report.timestamp).toBeGreaterThanOrEqual(before);
            expect(report.timestamp).toBeLessThanOrEqual(after);
        });

    });

});
