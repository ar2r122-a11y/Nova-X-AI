import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryEngine } from "../Contracts/IStoryEngine";
import type { IStoryRepository } from "../Domain/Repositories/IStoryRepository";
import type { IQuestRepository } from "../Domain/Repositories/IQuestRepository";
import type { IEndingRegistryRepository } from "../Domain/Repositories/IEndingRegistryRepository";
import type { IStoryEventStoreRepository } from "../Domain/Repositories/IStoryEventStoreRepository";
import type { IStoryDomainService } from "../Domain/Services/IStoryDomainService";
import type { IProgressionCalculator } from "../Domain/Services/IProgressionCalculator";
import type { IBranchingService } from "../Domain/Services/IBranchingService";
import { StoryDomainServiceImpl } from "../Domain/Services/StoryDomainServiceImpl";
import { ProgressionCalculator } from "../Domain/Services/ProgressionCalculator";
import { BranchingService } from "../Domain/Services/BranchingService";
import { StoryRepositoryFactory } from "./Persistence/StoryRepositoryFactory";
import { StartStoryCommand } from "../Application/Commands/StartStoryCommand";
import { AdvanceSceneCommand } from "../Application/Commands/AdvanceSceneCommand";
import { SelectChoiceCommand } from "../Application/Commands/SelectChoiceCommand";
import { CompleteStoryCommand } from "../Application/Commands/CompleteStoryCommand";
import { FailStoryCommand } from "../Application/Commands/FailStoryCommand";
import { UpdateQuestCommand } from "../Application/Commands/UpdateQuestCommand";
import { UpdateObjectiveCommand } from "../Application/Commands/UpdateObjectiveCommand";
import { GetStoryQuery } from "../Application/Queries/GetStoryQuery";
import { GetStoryProgressQuery } from "../Application/Queries/GetStoryProgressQuery";
import { GetQuestQuery } from "../Application/Queries/GetQuestQuery";
import { GetAvailableBranchesQuery } from "../Application/Queries/GetAvailableBranchesQuery";
import { ListStoriesQuery } from "../Application/Queries/ListStoriesQuery";
import { StoryAggregateDto } from "../Application/DTO/StoryAggregateDto";
import { QuestDto } from "../Application/DTO/QuestDto";
import { ObjectiveDto } from "../Application/DTO/ObjectiveDto";
import { BranchDto } from "../Application/DTO/BranchDto";
import { StorySummaryDto } from "../Application/DTO/StorySummaryDto";
import { StoryProgressDto } from "../Application/DTO/StoryProgressDto";
import { StartStoryCommandHandler } from "../Application/Handlers/StartStoryCommandHandler";
import { AdvanceSceneCommandHandler } from "../Application/Handlers/AdvanceSceneCommandHandler";
import { SelectChoiceCommandHandler } from "../Application/Handlers/SelectChoiceCommandHandler";
import { CompleteStoryCommandHandler } from "../Application/Handlers/CompleteStoryCommandHandler";
import { FailStoryCommandHandler } from "../Application/Handlers/FailStoryCommandHandler";
import { UpdateQuestCommandHandler } from "../Application/Handlers/UpdateQuestCommandHandler";
import { UpdateObjectiveCommandHandler } from "../Application/Handlers/UpdateObjectiveCommandHandler";
import { GetStoryQueryHandler } from "../Application/Handlers/GetStoryQueryHandler";
import { GetStoryProgressQueryHandler } from "../Application/Handlers/GetStoryProgressQueryHandler";
import { GetQuestQueryHandler } from "../Application/Handlers/GetQuestQueryHandler";
import { GetAvailableBranchesQueryHandler } from "../Application/Handlers/GetAvailableBranchesQueryHandler";
import { ListStoriesQueryHandler } from "../Application/Handlers/ListStoriesQueryHandler";

export class StoryEngine implements IStoryEngine {
    readonly eventBus: IEventBus;
    readonly storyRepository: IStoryRepository;
    readonly questRepository: IQuestRepository;
    readonly endingRegistryRepository: IEndingRegistryRepository;
    readonly eventStoreRepository: IStoryEventStoreRepository;
    readonly storyDomainService: IStoryDomainService;
    readonly progressionCalculator: IProgressionCalculator;
    readonly branchingService: IBranchingService;

    private readonly startStoryHandler: StartStoryCommandHandler;
    private readonly advanceSceneHandler: AdvanceSceneCommandHandler;
    private readonly selectChoiceHandler: SelectChoiceCommandHandler;
    private readonly completeStoryHandler: CompleteStoryCommandHandler;
    private readonly failStoryHandler: FailStoryCommandHandler;
    private readonly updateQuestHandler: UpdateQuestCommandHandler;
    private readonly updateObjectiveHandler: UpdateObjectiveCommandHandler;
    private readonly getStoryHandler: GetStoryQueryHandler;
    private readonly getStoryProgressHandler: GetStoryProgressQueryHandler;
    private readonly getQuestHandler: GetQuestQueryHandler;
    private readonly getAvailableBranchesHandler: GetAvailableBranchesQueryHandler;
    private readonly listStoriesHandler: ListStoriesQueryHandler;

    constructor(eventBus: IEventBus, storageEngine: { getEventStore(): any }) {
        this.eventBus = eventBus;
        const repos = StoryRepositoryFactory.createRepositories(storageEngine as any);
        this.storyRepository = repos.storyRepository;
        this.questRepository = repos.questRepository;
        this.endingRegistryRepository = repos.endingRegistryRepository;
        this.eventStoreRepository = repos.eventStoreRepository;
        this.storyDomainService = new StoryDomainServiceImpl(
            eventBus,
            this.storyRepository,
            this.questRepository,
            this.endingRegistryRepository,
            this.eventStoreRepository
        );
        this.progressionCalculator = new ProgressionCalculator();
        this.branchingService = new BranchingService();

        this.startStoryHandler = new StartStoryCommandHandler(eventBus, this.storyRepository, this.storyDomainService);
        this.advanceSceneHandler = new AdvanceSceneCommandHandler(eventBus, this.storyRepository, this.storyDomainService);
        this.selectChoiceHandler = new SelectChoiceCommandHandler(eventBus, this.storyRepository, this.storyDomainService);
        this.completeStoryHandler = new CompleteStoryCommandHandler(eventBus, this.storyRepository, this.storyDomainService);
        this.failStoryHandler = new FailStoryCommandHandler(eventBus, this.storyRepository, this.storyDomainService);
        this.updateQuestHandler = new UpdateQuestCommandHandler(this.storyRepository, this.questRepository);
        this.updateObjectiveHandler = new UpdateObjectiveCommandHandler(this.questRepository);
        this.getStoryHandler = new GetStoryQueryHandler(this.storyRepository);
        this.getStoryProgressHandler = new GetStoryProgressQueryHandler(this.storyRepository, this.progressionCalculator);
        this.getQuestHandler = new GetQuestQueryHandler(this.questRepository);
        this.getAvailableBranchesHandler = new GetAvailableBranchesQueryHandler(this.storyRepository, this.branchingService);
        this.listStoriesHandler = new ListStoriesQueryHandler(this.storyRepository);
    }

    async startStory(command: StartStoryCommand): Promise<StoryAggregateDto> {
        return this.startStoryHandler.handle(command);
    }

    async advanceScene(command: AdvanceSceneCommand): Promise<StoryAggregateDto> {
        return this.advanceSceneHandler.handle(command);
    }

    async selectChoice(command: SelectChoiceCommand): Promise<StoryAggregateDto> {
        return this.selectChoiceHandler.handle(command);
    }

    async completeStory(command: CompleteStoryCommand): Promise<StoryAggregateDto> {
        return this.completeStoryHandler.handle(command);
    }

    async failStory(command: FailStoryCommand): Promise<StoryAggregateDto> {
        return this.failStoryHandler.handle(command);
    }

    async updateQuest(command: UpdateQuestCommand): Promise<QuestDto> {
        return this.updateQuestHandler.handle(command);
    }

    async updateObjective(command: UpdateObjectiveCommand): Promise<ObjectiveDto> {
        return this.updateObjectiveHandler.handle(command);
    }

    async getStory(query: GetStoryQuery): Promise<StoryAggregateDto | null> {
        return this.getStoryHandler.handle(query);
    }

    async getStoryProgress(query: GetStoryProgressQuery): Promise<StoryProgressDto | null> {
        return this.getStoryProgressHandler.handle(query);
    }

    async getQuest(query: GetQuestQuery): Promise<QuestDto | null> {
        return this.getQuestHandler.handle(query);
    }

    async getAvailableBranches(query: GetAvailableBranchesQuery): Promise<BranchDto[]> {
        return this.getAvailableBranchesHandler.handle(query);
    }

    async listStories(query: ListStoriesQuery): Promise<StorySummaryDto[]> {
        return this.listStoriesHandler.handle(query);
    }
}
