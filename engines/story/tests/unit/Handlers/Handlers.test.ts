import { describe, test, expect, vi } from "vitest";
import { StartStoryCommandHandler } from "../../../src/Application/Handlers/StartStoryCommandHandler";
import { AdvanceSceneCommandHandler } from "../../../src/Application/Handlers/AdvanceSceneCommandHandler";
import { AdvancePlotCommandHandler } from "../../../src/Application/Handlers/AdvancePlotCommandHandler";
import { SelectChoiceCommandHandler } from "../../../src/Application/Handlers/SelectChoiceCommandHandler";
import { CompleteStoryCommandHandler } from "../../../src/Application/Handlers/CompleteStoryCommandHandler";
import { FailStoryCommandHandler } from "../../../src/Application/Handlers/FailStoryCommandHandler";
import { UpdateQuestCommandHandler } from "../../../src/Application/Handlers/UpdateQuestCommandHandler";
import { UpdateObjectiveCommandHandler } from "../../../src/Application/Handlers/UpdateObjectiveCommandHandler";
import { GetStoryQueryHandler } from "../../../src/Application/Handlers/GetStoryQueryHandler";
import { GetStoryProgressQueryHandler } from "../../../src/Application/Handlers/GetStoryProgressQueryHandler";
import { GetQuestQueryHandler } from "../../../src/Application/Handlers/GetQuestQueryHandler";
import { GetAvailableBranchesQueryHandler } from "../../../src/Application/Handlers/GetAvailableBranchesQueryHandler";
import { GetPlotStateQueryHandler } from "../../../src/Application/Handlers/GetPlotStateQueryHandler";
import { ListStoriesQueryHandler } from "../../../src/Application/Handlers/ListStoriesQueryHandler";
import { StoryAggregate } from "../../../src/Domain/Aggregates/StoryAggregate";
import { StoryAggregateDto } from "../../../src/Application/DTO/StoryAggregateDto";
import { QuestDto } from "../../../src/Application/DTO/QuestDto";
import { ObjectiveDto } from "../../../src/Application/DTO/ObjectiveDto";
import { BranchDto } from "../../../src/Application/DTO/BranchDto";
import { StoryProgressDto } from "../../../src/Application/DTO/StoryProgressDto";
import { PlotStateDto } from "../../../src/Application/DTO/PlotStateDto";
import { StorySummaryDto } from "../../../src/Application/DTO/StorySummaryDto";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";
import { SceneId } from "../../../src/Domain/ValueObjects/SceneId";
import { QuestId } from "../../../src/Domain/ValueObjects/QuestId";
import { ObjectiveId } from "../../../src/Domain/ValueObjects/ObjectiveId";
import { BranchId } from "../../../src/Domain/ValueObjects/BranchId";
import { EndingId } from "../../../src/Domain/ValueObjects/EndingId";
import { ChapterId } from "../../../src/Domain/ValueObjects/ChapterId";
import { StoryProgress } from "../../../src/Domain/ValueObjects/StoryProgress";
import { StartStoryCommand } from "../../../src/Application/Commands/StartStoryCommand";
import { AdvanceSceneCommand } from "../../../src/Application/Commands/AdvanceSceneCommand";
import { AdvancePlotCommand } from "../../../src/Application/Commands/AdvancePlotCommand";
import { SelectChoiceCommand } from "../../../src/Application/Commands/SelectChoiceCommand";
import { CompleteStoryCommand } from "../../../src/Application/Commands/CompleteStoryCommand";
import { FailStoryCommand } from "../../../src/Application/Commands/FailStoryCommand";
import { UpdateQuestCommand } from "../../../src/Application/Commands/UpdateQuestCommand";
import { UpdateObjectiveCommand } from "../../../src/Application/Commands/UpdateObjectiveCommand";
import { GetStoryQuery } from "../../../src/Application/Queries/GetStoryQuery";
import { GetStoryProgressQuery } from "../../../src/Application/Queries/GetStoryProgressQuery";
import { GetQuestQuery } from "../../../src/Application/Queries/GetQuestQuery";
import { GetAvailableBranchesQuery } from "../../../src/Application/Queries/GetAvailableBranchesQuery";
import { GetPlotStateQuery } from "../../../src/Application/Queries/GetPlotStateQuery";
import { ListStoriesQuery } from "../../../src/Application/Queries/ListStoriesQuery";
import { Chapter } from "../../../src/Domain/Entities/Chapter";
import { Scene } from "../../../src/Domain/Entities/Scene";
import { Quest } from "../../../src/Domain/Entities/Quest";
import { Objective } from "../../../src/Domain/Entities/Objective";
import { Ending } from "../../../src/Domain/Entities/Ending";

const UUID = "123e4567-e89b-12d3-a456-426614174000";
const UUID2 = "223e4567-e89b-12d3-a456-426614174000";
const UUID3 = "323e4567-e89b-12d3-a456-426614174000";

const createMockEventBus = () => ({
    publish: vi.fn(),
    subscribe: vi.fn(),
});

const createMockStoryRepository = () => ({
    save: vi.fn(),
    getById: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
});

const createMockQuestRepository = () => ({
    save: vi.fn(),
    getById: vi.fn(),
    getByStoryId: vi.fn(),
    delete: vi.fn(),
});

const createMockStoryDomainService = () => ({
    startStory: vi.fn(),
    advanceScene: vi.fn(),
    selectChoice: vi.fn(),
    completeStory: vi.fn(),
    failStory: vi.fn(),
});

const createMockProgressionCalculator = () => ({
    calculateStoryProgress: vi.fn(),
    calculateChapterProgress: vi.fn(),
    calculateQuestProgress: vi.fn(),
    calculateObjectiveProgress: vi.fn(),
});

const createMockBranchingService = () => ({
    resolveBranch: vi.fn(),
    validateBranchCondition: vi.fn(),
    getAvailableBranches: vi.fn(),
});

describe("Command Handlers", () => {
    describe("StartStoryCommandHandler", () => {
        test("throws on validation failure", async () => {
            const handler = new StartStoryCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                createMockStoryDomainService()
            );
            await expect(handler.handle(new StartStoryCommand("", "Title", "Desc", { roles: [] }))).rejects.toThrow("StoryId is required.");
        });

        test("delegates to storyDomainService", async () => {
            const storyDomainService = createMockStoryDomainService();
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            storyDomainService.startStory.mockResolvedValue(aggregate);
            const handler = new StartStoryCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                storyDomainService
            );
            const result = await handler.handle(new StartStoryCommand(UUID, "Title", "Desc", { roles: ["story:write"] }));
            expect(storyDomainService.startStory).toHaveBeenCalled();
            expect(result).toBeInstanceOf(StoryAggregateDto);
        });
    });

    describe("AdvanceSceneCommandHandler", () => {
        test("throws on validation failure", async () => {
            const handler = new AdvanceSceneCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                createMockStoryDomainService()
            );
            await expect(handler.handle(new AdvanceSceneCommand(UUID, "", { roles: [] }))).rejects.toThrow("SceneId is required.");
        });

        test("delegates to storyDomainService", async () => {
            const storyDomainService = createMockStoryDomainService();
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            storyDomainService.advanceScene.mockResolvedValue(aggregate);
            const handler = new AdvanceSceneCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                storyDomainService
            );
            const result = await handler.handle(new AdvanceSceneCommand(UUID, UUID2, { roles: ["story:write"] }));
            expect(storyDomainService.advanceScene).toHaveBeenCalled();
            expect(result).toBeInstanceOf(StoryAggregateDto);
        });
    });

    describe("AdvancePlotCommandHandler", () => {
        test("throws when story not found", async () => {
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(null);
            const handler = new AdvancePlotCommandHandler(
                createMockEventBus(),
                storyRepository,
                createMockStoryDomainService()
            );
            await expect(handler.handle(new AdvancePlotCommand(UUID, { roles: ["story:write"] }))).rejects.toThrow("Story not found");
        });

        test("advances to first scene when no current scene", async () => {
            const storyDomainService = createMockStoryDomainService();
            const storyId = StoryId.create(UUID);
            const chapterId = ChapterId.create(UUID2);
            const scene = Scene.create({ chapterId, title: "Scene 1", description: "Desc", status: { getValue: () => "pending" } as any, type: { getValue: () => "narrative" } as any, order: 0 });
            const aggregate = StoryAggregate.reconstitute({
                storyId,
                title: "Title",
                description: "Desc",
                state: { getValue: () => "initialized" } as any,
                status: { getValue: () => "draft" } as any,
                chapters: [],
                scenes: [scene],
                quests: [],
                endings: [],
                branches: [],
                flags: new Map(),
                progress: {
                    getValue: () => ({}),
                    getCurrentChapterId: () => null,
                    getCurrentSceneId: () => null,
                    getCompletedScenes: () => [],
                    getActiveQuests: () => [],
                    getCompletedQuests: () => [],
                    getNarrativeFlags: () => new Map(),
                    withCurrentScene: () => ({} as any),
                    withFlag: () => ({} as any),
                } as any,
                version: { getValue: () => 0, next: () => ({ getValue: () => 0 } as any) } as any,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            storyDomainService.advanceScene.mockResolvedValue(aggregate);
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(aggregate);
            const handler = new AdvancePlotCommandHandler(
                createMockEventBus(),
                storyRepository,
                storyDomainService
            );
            const result = await handler.handle(new AdvancePlotCommand(UUID, { roles: ["story:write"] }));
            expect(storyDomainService.advanceScene).toHaveBeenCalled();
            expect(result).toBeInstanceOf(StoryAggregateDto);
        });
    });

    describe("SelectChoiceCommandHandler", () => {
        test("throws on validation failure", async () => {
            const handler = new SelectChoiceCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                createMockStoryDomainService()
            );
            await expect(handler.handle(new SelectChoiceCommand(UUID, UUID2, "", UUID3, { roles: [] }))).rejects.toThrow("ChoiceId is required.");
        });

        test("delegates to storyDomainService", async () => {
            const storyDomainService = createMockStoryDomainService();
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            storyDomainService.selectChoice.mockResolvedValue(aggregate);
            const handler = new SelectChoiceCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                storyDomainService
            );
            const result = await handler.handle(new SelectChoiceCommand(UUID, UUID2, "choice-1", UUID3, { roles: ["story:write"] }));
            expect(storyDomainService.selectChoice).toHaveBeenCalled();
            expect(result).toBeInstanceOf(StoryAggregateDto);
        });
    });

    describe("CompleteStoryCommandHandler", () => {
        test("throws on validation failure", async () => {
            const handler = new CompleteStoryCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                createMockStoryDomainService()
            );
            await expect(handler.handle(new CompleteStoryCommand(UUID, "", { roles: [] }))).rejects.toThrow("EndingId is required.");
        });

        test("delegates to storyDomainService", async () => {
            const storyDomainService = createMockStoryDomainService();
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            storyDomainService.completeStory.mockResolvedValue(aggregate);
            const handler = new CompleteStoryCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                storyDomainService
            );
            const result = await handler.handle(new CompleteStoryCommand(UUID, UUID2, { roles: ["story:write"] }));
            expect(storyDomainService.completeStory).toHaveBeenCalled();
            expect(result).toBeInstanceOf(StoryAggregateDto);
        });
    });

    describe("FailStoryCommandHandler", () => {
        test("throws on validation failure", async () => {
            const handler = new FailStoryCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                createMockStoryDomainService()
            );
            await expect(handler.handle(new FailStoryCommand(UUID, "", { roles: [] }))).rejects.toThrow("Reason is required.");
        });

        test("delegates to storyDomainService", async () => {
            const storyDomainService = createMockStoryDomainService();
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            storyDomainService.failStory.mockResolvedValue(aggregate);
            const handler = new FailStoryCommandHandler(
                createMockEventBus(),
                createMockStoryRepository(),
                storyDomainService
            );
            const result = await handler.handle(new FailStoryCommand(UUID, "reason", { roles: ["story:write"] }));
            expect(storyDomainService.failStory).toHaveBeenCalled();
            expect(result).toBeInstanceOf(StoryAggregateDto);
        });
    });

    describe("UpdateQuestCommandHandler", () => {
        test("throws on validation failure", async () => {
            const handler = new UpdateQuestCommandHandler(
                createMockStoryRepository(),
                createMockQuestRepository()
            );
            await expect(handler.handle(new UpdateQuestCommand("", UUID2, "activate", { roles: [] }))).rejects.toThrow("StoryId is required.");
        });

        test("throws when quest not found", async () => {
            const questRepository = createMockQuestRepository();
            questRepository.getById.mockResolvedValue(null);
            const handler = new UpdateQuestCommandHandler(
                createMockStoryRepository(),
                questRepository
            );
            await expect(handler.handle(new UpdateQuestCommand(UUID, UUID2, "activate", { roles: ["story:write"] }))).rejects.toThrow("Quest not found");
        });
    });

    describe("UpdateObjectiveCommandHandler", () => {
        test("throws on validation failure", async () => {
            const handler = new UpdateObjectiveCommandHandler(
                createMockQuestRepository()
            );
            await expect(handler.handle(new UpdateObjectiveCommand("", UUID2, UUID3, { roles: [] }, "activate"))).rejects.toThrow("StoryId is required.");
        });

        test("throws when quest not found", async () => {
            const questRepository = createMockQuestRepository();
            questRepository.getById.mockResolvedValue(null);
            const handler = new UpdateObjectiveCommandHandler(questRepository);
            await expect(handler.handle(new UpdateObjectiveCommand(UUID, UUID2, UUID3, { roles: ["story:write"] }, "activate"))).rejects.toThrow("Quest not found");
        });
    });
});

describe("Query Handlers", () => {
    describe("GetStoryQueryHandler", () => {
        test("returns null when story not found", async () => {
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(null);
            const handler = new GetStoryQueryHandler(storyRepository);
            const result = await handler.handle(new GetStoryQuery(UUID, "user-1"));
            expect(result).toBeNull();
        });

        test("returns dto when story found", async () => {
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(aggregate);
            const handler = new GetStoryQueryHandler(storyRepository);
            const result = await handler.handle(new GetStoryQuery(UUID, "user-1"));
            expect(result).toBeInstanceOf(StoryAggregateDto);
        });
    });

    describe("GetStoryProgressQueryHandler", () => {
        test("returns null when story not found", async () => {
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(null);
            const handler = new GetStoryProgressQueryHandler(storyRepository, createMockProgressionCalculator());
            const result = await handler.handle(new GetStoryProgressQuery(UUID, "user-1"));
            expect(result).toBeNull();
        });

        test("returns progress dto when story found", async () => {
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(aggregate);
            const progressionCalculator = createMockProgressionCalculator();
            progressionCalculator.calculateStoryProgress.mockReturnValue(StoryProgress.initial());
            const handler = new GetStoryProgressQueryHandler(storyRepository, progressionCalculator);
            const result = await handler.handle(new GetStoryProgressQuery(UUID, "user-1"));
            expect(result).toBeInstanceOf(StoryProgressDto);
        });
    });

    describe("GetQuestQueryHandler", () => {
        test("returns null when quest not found", async () => {
            const questRepository = createMockQuestRepository();
            questRepository.getById.mockResolvedValue(null);
            const handler = new GetQuestQueryHandler(questRepository);
            const result = await handler.handle(new GetQuestQuery(UUID, UUID2, "user-1"));
            expect(result).toBeNull();
        });

        test("returns dto when quest found", async () => {
            const quest = Quest.create({ storyId: StoryId.create(UUID), title: "Quest 1", type: { getValue: () => "main" } as any, status: { getValue: () => "active" } as any } as any);
            const questRepository = createMockQuestRepository();
            questRepository.getById.mockResolvedValue(quest);
            const handler = new GetQuestQueryHandler(questRepository);
            const result = await handler.handle(new GetQuestQuery(UUID, UUID2, "user-1"));
            expect(result).toBeInstanceOf(QuestDto);
        });
    });

    describe("GetAvailableBranchesQueryHandler", () => {
        test("returns empty array when story not found", async () => {
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(null);
            const handler = new GetAvailableBranchesQueryHandler(storyRepository, createMockBranchingService());
            const result = await handler.handle(new GetAvailableBranchesQuery(UUID, UUID2, {}, "user-1"));
            expect(result).toEqual([]);
        });
    });

    describe("GetPlotStateQueryHandler", () => {
        test("returns null when story not found", async () => {
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(null);
            const handler = new GetPlotStateQueryHandler(storyRepository);
            const result = await handler.handle(new GetPlotStateQuery(UUID, "user-1"));
            expect(result).toBeNull();
        });

        test("returns plot state when story found", async () => {
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            const storyRepository = createMockStoryRepository();
            storyRepository.getById.mockResolvedValue(aggregate);
            const handler = new GetPlotStateQueryHandler(storyRepository);
            const result = await handler.handle(new GetPlotStateQuery(UUID, "user-1"));
            expect(result).toBeInstanceOf(PlotStateDto);
        });
    });

    describe("ListStoriesQueryHandler", () => {
        test("returns empty array when no stories", async () => {
            const storyRepository = createMockStoryRepository();
            storyRepository.getAll.mockResolvedValue([]);
            const handler = new ListStoriesQueryHandler(storyRepository);
            const result = await handler.handle(new ListStoriesQuery("user-1"));
            expect(result).toEqual([]);
        });

        test("filters by status when provided", async () => {
            const aggregate = StoryAggregate.create(StoryId.create(UUID), "Title", "Desc");
            aggregate.start();
            const storyRepository = createMockStoryRepository();
            storyRepository.getAll.mockResolvedValue([aggregate]);
            const handler = new ListStoriesQueryHandler(storyRepository);
            const result = await handler.handle(new ListStoriesQuery("user-1", "active"));
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(StorySummaryDto);
        });
    });
});
