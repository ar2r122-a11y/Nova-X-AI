import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryRepository } from "../Domain/Repositories/IStoryRepository";
import type { IQuestRepository } from "../Domain/Repositories/IQuestRepository";
import type { IEndingRegistryRepository } from "../Domain/Repositories/IEndingRegistryRepository";
import type { IStoryEventStoreRepository } from "../Domain/Repositories/IStoryEventStoreRepository";
import type { IStoryDomainService } from "../Domain/Services/IStoryDomainService";
import type { IProgressionCalculator } from "../Domain/Services/IProgressionCalculator";
import type { IBranchingService } from "../Domain/Services/IBranchingService";
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

export interface IStoryEngine {
    readonly eventBus: IEventBus;
    readonly storyRepository: IStoryRepository;
    readonly questRepository: IQuestRepository;
    readonly endingRegistryRepository: IEndingRegistryRepository;
    readonly eventStoreRepository: IStoryEventStoreRepository;
    readonly storyDomainService: IStoryDomainService;
    readonly progressionCalculator: IProgressionCalculator;
    readonly branchingService: IBranchingService;

    startStory(command: StartStoryCommand): Promise<StoryAggregateDto>;
    advanceScene(command: AdvanceSceneCommand): Promise<StoryAggregateDto>;
    selectChoice(command: SelectChoiceCommand): Promise<StoryAggregateDto>;
    completeStory(command: CompleteStoryCommand): Promise<StoryAggregateDto>;
    failStory(command: FailStoryCommand): Promise<StoryAggregateDto>;
    updateQuest(command: UpdateQuestCommand): Promise<QuestDto>;
    updateObjective(command: UpdateObjectiveCommand): Promise<ObjectiveDto>;
    getStory(query: GetStoryQuery): Promise<StoryAggregateDto | null>;
    getStoryProgress(query: GetStoryProgressQuery): Promise<StoryProgressDto | null>;
    getQuest(query: GetQuestQuery): Promise<QuestDto | null>;
    getAvailableBranches(query: GetAvailableBranchesQuery): Promise<BranchDto[]>;
    listStories(query: ListStoriesQuery): Promise<StorySummaryDto[]>;
}

export interface IStartStoryCommand {
    readonly storyId: string;
    readonly title: string;
    readonly description: string;
    readonly claims: { roles: string[] };
}

export interface IAdvanceSceneCommand {
    readonly storyId: string;
    readonly sceneId: string;
    readonly claims: { roles: string[] };
}

export interface ISelectChoiceCommand {
    readonly storyId: string;
    readonly sceneId: string;
    readonly choiceId: string;
    readonly branchId: string;
    readonly claims: { roles: string[] };
}

export interface ICompleteStoryCommand {
    readonly storyId: string;
    readonly endingId: string;
    readonly claims: { roles: string[] };
}

export interface IFailStoryCommand {
    readonly storyId: string;
    readonly reason: string;
    readonly claims: { roles: string[] };
}

export interface IUpdateQuestCommand {
    readonly storyId: string;
    readonly questId: string;
    readonly action: "activate" | "complete" | "fail";
    readonly claims: { roles: string[] };
}

export interface IUpdateObjectiveCommand {
    readonly storyId: string;
    readonly questId: string;
    readonly objectiveId: string;
    readonly action: "activate" | "complete" | "fail" | "setProgress";
    readonly progress?: number;
    readonly claims: { roles: string[] };
}

export interface IGetStoryQuery {
    readonly storyId: string;
    readonly requesterId: string;
}

export interface IGetStoryProgressQuery {
    readonly storyId: string;
    readonly requesterId: string;
}

export interface IGetQuestQuery {
    readonly storyId: string;
    readonly questId: string;
    readonly requesterId: string;
}

export interface IGetAvailableBranchesQuery {
    readonly storyId: string;
    readonly sceneId: string;
    readonly context: Record<string, unknown>;
    readonly requesterId: string;
}

export interface IListStoriesQuery {
    readonly requesterId: string;
    readonly status?: string;
}

export interface IStorySnapshotManager {
    takeSnapshot(storyId: string): Promise<object>;
    restoreFromSnapshot(storyId: string, snapshot: object): Promise<void>;
    listSnapshots(storyId: string): Promise<{ timestamp: number; version: number }[]>;
    deleteSnapshot(storyId: string, timestamp: number): Promise<void>;
    shouldCreateSnapshot(version: number): boolean;
}
