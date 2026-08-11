import { QuestAggregate } from "../../Domain/Aggregates/QuestAggregate";
import { Quest } from "../../Domain/Entities/Quest";
import { ObjectiveDto } from "./ObjectiveDto";

export class QuestDto {
    questId: string;
    storyId: string;
    title: string;
    description: string;
    type: string;
    status: string;
    objectives: ObjectiveDto[];
    rewards: Record<string, unknown>;
    prerequisites: string[];
    narrativeFlags: Record<string, unknown>;
    progress: number;
    createdAt: number;
    updatedAt: number;

    constructor(
        questId: string,
        storyId: string,
        title: string,
        description: string,
        type: string,
        status: string,
        objectives: ObjectiveDto[],
        rewards: Record<string, unknown>,
        prerequisites: string[],
        narrativeFlags: Record<string, unknown>,
        progress: number,
        createdAt: number,
        updatedAt: number
    ) {
        this.questId = questId;
        this.storyId = storyId;
        this.title = title;
        this.description = description;
        this.type = type;
        this.status = status;
        this.objectives = objectives;
        this.rewards = rewards;
        this.prerequisites = prerequisites;
        this.narrativeFlags = narrativeFlags;
        this.progress = progress;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromAggregate(aggregate: QuestAggregate): QuestDto {
        const rewards: Record<string, unknown> = {};
        aggregate.getRewards().forEach((value, key) => {
            rewards[key] = value;
        });

        const narrativeFlags: Record<string, unknown> = {};
        aggregate.getNarrativeFlags().forEach((value, key) => {
            narrativeFlags[key] = value;
        });

        return new QuestDto(
            aggregate.getQuestId().getValue(),
            aggregate.getStoryId().getValue(),
            aggregate.getTitle(),
            aggregate.getDescription(),
            aggregate.getType().getValue(),
            aggregate.getStatus().getValue(),
            aggregate.getObjectives().map((objective) => ObjectiveDto.fromEntity(objective)),
            rewards,
            [...aggregate.getPrerequisites()],
            narrativeFlags,
            aggregate.getProgress(),
            aggregate.getCreatedAt(),
            aggregate.getUpdatedAt()
        );
    }

    static fromEntity(quest: Quest): QuestDto {
        const rewards: Record<string, unknown> = {};
        quest.getRewards().forEach((value, key) => {
            rewards[key] = value;
        });

        const narrativeFlags: Record<string, unknown> = {};
        quest.getNarrativeFlags().forEach((value, key) => {
            narrativeFlags[key] = value;
        });

        return new QuestDto(
            quest.getId().getValue(),
            quest.getStoryId().getValue(),
            quest.getTitle(),
            quest.getDescription(),
            quest.getType().getValue(),
            quest.getStatus().getValue(),
            quest.getObjectives().map((objective) => ObjectiveDto.fromEntity(objective)),
            rewards,
            [...quest.getPrerequisites()],
            narrativeFlags,
            quest.getProgress(),
            quest.getCreatedAt(),
            quest.getUpdatedAt()
        );
    }
}
