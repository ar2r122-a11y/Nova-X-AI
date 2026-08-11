import { describe, test, expect, vi } from "vitest";
import { StoryRecoveryManager } from "../../../src/Infrastructure/Recovery/StoryRecoveryManager";

describe("StoryRecoveryManager", () => {
    const mockEventStoreRepository = {
        readStream: vi.fn(),
        getStreamEvents: vi.fn(),
    } as any;
    const mockStoryRepository = {
        getById: vi.fn(),
        save: vi.fn(),
    } as any;
    const mockSnapshotManager = {
        listSnapshots: vi.fn(),
        takeSnapshot: vi.fn(),
    } as any;

    const recoveryManager = new StoryRecoveryManager(mockEventStoreRepository, mockStoryRepository, mockSnapshotManager);

    test("recovers story from snapshot and events", async () => {
        mockSnapshotManager.listSnapshots.mockResolvedValue([{ version: 1, timestamp: Date.now() }]);
        mockSnapshotManager.takeSnapshot.mockResolvedValue({});
        mockStoryRepository.getById.mockResolvedValue({
            getStoryId: () => ({ getValue: () => "44444444-4444-4444-4444-444444444444" }),
            getVersion: () => ({ getValue: () => 1 }),
            commitEvents: vi.fn(),
        });
        mockEventStoreRepository.readStream.mockResolvedValue([]);

        const result = await recoveryManager.recoverStory("44444444-4444-4444-4444-444444444444");
        expect(mockStoryRepository.save).toHaveBeenCalled();
    });

    test("recovers worker", async () => {
        await expect(recoveryManager.recoverWorker("worker-1")).resolves.toBeUndefined();
    });

    test("recovers projection", async () => {
        await expect(recoveryManager.recoverProjection("proj-1")).resolves.toBeUndefined();
    });

    test("validates snapshot object", () => {
        expect(recoveryManager.validateSnapshot({})).toBe(true);
        expect(recoveryManager.validateSnapshot(null)).toBe(false);
    });

    test("handles event store failure", async () => {
        mockStoryRepository.getById.mockResolvedValue({
            getStoryId: () => ({ getValue: () => "44444444-4444-4444-4444-444444444444" }),
        });

        const result = await recoveryManager.handleEventStoreFailure("44444444-4444-4444-4444-444444444444");
        expect(result).toBeDefined();
    });
});
