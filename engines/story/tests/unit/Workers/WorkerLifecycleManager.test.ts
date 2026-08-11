import { describe, test, expect, vi } from "vitest";
import { WorkerLifecycleManager } from "../../../src/Infrastructure/Workers/WorkerLifecycleManager";
import type { IStoryWorker } from "../../../src/Infrastructure/Workers/IStoryWorker";
import { WorkerHealthState } from "../../../src/Domain/ValueObjects/WorkerHealthState";

describe("WorkerLifecycleManager", () => {
    test("registers and starts workers", async () => {
        const manager = new WorkerLifecycleManager();
        const worker = {
            getWorkerName: () => "test-worker",
            start: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
            stop: vi.fn(),
            getHealthState: () => WorkerHealthState.Running,
            isRunning: () => false,
        } as unknown as IStoryWorker;

        manager.registerWorker(worker);
        await manager.startAll();
        expect(worker.start).toHaveBeenCalled();
    });

    test("pauses and resumes workers", async () => {
        const manager = new WorkerLifecycleManager();
        const worker = {
            getWorkerName: () => "test-worker",
            start: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
            stop: vi.fn(),
            getHealthState: () => WorkerHealthState.Paused,
            isRunning: () => true,
        } as unknown as IStoryWorker;

        manager.registerWorker(worker);
        await manager.pauseAll();
        expect(worker.pause).toHaveBeenCalled();
    });

    test("stops all workers", async () => {
        const manager = new WorkerLifecycleManager();
        const worker = {
            getWorkerName: () => "test-worker",
            start: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
            stop: vi.fn(),
            getHealthState: () => WorkerHealthState.Stopped,
            isRunning: () => false,
        } as unknown as IStoryWorker;

        manager.registerWorker(worker);
        await manager.stopAll();
        expect(worker.stop).toHaveBeenCalled();
    });

    test("returns worker health map", async () => {
        const manager = new WorkerLifecycleManager();
        const worker = {
            getWorkerName: () => "test-worker",
            start: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
            stop: vi.fn(),
            getHealthState: () => WorkerHealthState.Running,
            isRunning: () => true,
        } as unknown as IStoryWorker;

        manager.registerWorker(worker);
        const health = manager.getWorkerHealth();
        expect(health["test-worker"]).toBe(WorkerHealthState.Running);
    });
});
