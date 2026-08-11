import { describe, test, expect, vi } from "vitest";
import { WorkerHealthState } from "../../../src/Domain/ValueObjects/WorkerHealthState";
import { StoryWorker } from "../../../src/Infrastructure/Workers/StoryWorker";
import { SnapshotWorker } from "../../../src/Infrastructure/Workers/SnapshotWorker";
import { ReplayWorker } from "../../../src/Infrastructure/Workers/ReplayWorker";
import { CleanupWorker } from "../../../src/Infrastructure/Workers/CleanupWorker";
import { SynchronizationWorker } from "../../../src/Infrastructure/Workers/SynchronizationWorker";
import { AnalyticsWorker } from "../../../src/Infrastructure/Workers/AnalyticsWorker";
import { ProjectionWorker } from "../../../src/Infrastructure/Workers/ProjectionWorker";
import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryDomainService } from "../../../src/Domain/Services/IStoryDomainService";
import type { IStorySnapshotManager } from "../../../src/Domain/Services/IStorySnapshotManager";
import type { IStoryEventStoreRepository } from "../../../src/Domain/Repositories/IStoryEventStoreRepository";
import type { IStoryRepository } from "../../../src/Domain/Repositories/IStoryRepository";

describe("StoryWorkers", () => {
    const mockEventBus = { publish: vi.fn() } as unknown as IEventBus;

    test("StoryWorker lifecycle", async () => {
        const worker = new StoryWorker(mockEventBus, {} as IStoryDomainService);
        expect(worker.getHealthState()).toBe(WorkerHealthState.Stopped);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.pause();
        expect(worker.getHealthState()).toBe(WorkerHealthState.Paused);
        await worker.resume();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
        expect(worker.isRunning()).toBe(false);
    });

    test("SnapshotWorker lifecycle", async () => {
        const worker = new SnapshotWorker(mockEventBus, {} as IStorySnapshotManager);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
    });

    test("ReplayWorker lifecycle", async () => {
        const worker = new ReplayWorker(mockEventBus, {} as IStoryEventStoreRepository, {} as IStoryRepository);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
    });

    test("CleanupWorker lifecycle", async () => {
        const worker = new CleanupWorker(mockEventBus);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
    });

    test("SynchronizationWorker lifecycle", async () => {
        const worker = new SynchronizationWorker(mockEventBus);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
    });

    test("AnalyticsWorker lifecycle", async () => {
        const worker = new AnalyticsWorker(mockEventBus);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
    });

    test("ProjectionWorker lifecycle", async () => {
        const worker = new ProjectionWorker(mockEventBus);
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
    });
});
