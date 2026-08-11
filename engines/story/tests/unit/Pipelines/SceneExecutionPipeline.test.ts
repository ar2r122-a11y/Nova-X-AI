import { describe, test, expect, vi } from "vitest";
import { SceneExecutionPipeline } from "../../../src/Application/Pipelines/SceneExecutionPipeline";

describe("SceneExecutionPipeline", () => {
    const mockEventBus = { publish: vi.fn() } as any;
    const mockStoryRepository = {
        getById: vi.fn(),
        save: vi.fn(),
    } as any;
    const mockEventStoreRepository = {
        getStreamEvents: vi.fn(),
        append: vi.fn(),
    } as any;
    const mockBranchingService = {
        getAvailableBranches: vi.fn(),
    } as any;
    const mockStoryDomainService = {
        advanceScene: vi.fn(),
    } as any;

    const pipeline = new SceneExecutionPipeline(
        mockStoryRepository,
        mockEventStoreRepository,
        mockBranchingService,
        mockStoryDomainService,
        mockEventBus
    );

    test("executes scene transition", async () => {
        mockStoryRepository.getById.mockResolvedValue({
            getStoryId: () => ({ getValue: () => "11111111-1111-1111-1111-111111111111" }),
            getScenes: () => [],
            getBranches: () => [],
            advanceScene: vi.fn(),
            commitEvents: vi.fn(),
        } as any);
        mockBranchingService.getAvailableBranches.mockReturnValue([]);
        mockStoryDomainService.advanceScene.mockResolvedValue({
            getStoryId: () => ({ getValue: () => "11111111-1111-1111-1111-111111111111" }),
            getUncommittedEvents: () => [],
            commitEvents: vi.fn(),
        } as any);

        await pipeline.execute("11111111-1111-1111-1111-111111111111", "22222222-2222-2222-2222-222222222222", { correlationId: "corr-1" });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });
});
