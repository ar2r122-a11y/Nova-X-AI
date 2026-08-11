import { describe, test, expect, vi } from "vitest";
import { StoryRecoveryManager } from "../../../src/Infrastructure/Recovery/StoryRecoveryManager";

describe("StoryRecoveryScenarios", () => {
    const createMocks = () => {
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

        return { mockEventStoreRepository, mockStoryRepository, mockSnapshotManager };
    };

    const createManager = () => {
        const { mockEventStoreRepository, mockStoryRepository, mockSnapshotManager } = createMocks();
        return {
            manager: new StoryRecoveryManager(mockEventStoreRepository, mockStoryRepository, mockSnapshotManager),
            mockEventStoreRepository,
            mockStoryRepository,
            mockSnapshotManager,
        };
    };

    test("recovery when Event Store read fails falls back to repository", async () => {
        const { manager, mockSnapshotManager, mockStoryRepository, mockEventStoreRepository } = createManager();
        mockSnapshotManager.listSnapshots.mockResolvedValue([]);
        mockStoryRepository.getById.mockResolvedValue({
            getStoryId: () => ({ getValue: () => "66666666-6666-6666-6666-666666666666" }),
            getVersion: () => ({ getValue: () => 0 }),
            commitEvents: vi.fn(),
        });
        mockEventStoreRepository.readStream.mockRejectedValue(new Error("Event Store read failure"));

        const result = await manager.recoverStory("66666666-6666-6666-6666-666666666666");
        expect(result).toBeDefined();
    });

    test("recovery when snapshot is corrupted falls back to repository", async () => {
        const { manager, mockSnapshotManager, mockStoryRepository } = createManager();
        mockSnapshotManager.listSnapshots.mockResolvedValue([{ version: 1, timestamp: Date.now() }]);
        mockSnapshotManager.takeSnapshot.mockResolvedValue(null);
        mockStoryRepository.getById.mockResolvedValue({
            getStoryId: () => ({ getValue: () => "66666666-6666-6666-6666-666666666666" }),
            getVersion: () => ({ getValue: () => 0 }),
            commitEvents: vi.fn(),
        });

        const result = await manager.recoverStory("66666666-6666-6666-6666-666666666666");
        expect(result).toBeDefined();
    });

    test("recovery when story is not found throws", async () => {
        const { manager, mockSnapshotManager, mockStoryRepository } = createManager();
        mockSnapshotManager.listSnapshots.mockResolvedValue([]);
        mockStoryRepository.getById.mockResolvedValue(null);

        await expect(manager.recoverStory("77777777-7777-7777-7777-777777777777")).rejects.toThrow("Story not found for recovery");
    });
});
