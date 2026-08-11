import { Objective } from "../../Domain/Entities/Objective";

export class ObjectiveDto {
    objectiveId: string;
    questId: string;
    description: string;
    type: string;
    status: string;
    requiredFlags: Record<string, unknown>;
    completionCriteria: Record<string, unknown>;
    progress: number;
    createdAt: number;
    updatedAt: number;

    constructor(
        objectiveId: string,
        questId: string,
        description: string,
        type: string,
        status: string,
        requiredFlags: Record<string, unknown>,
        completionCriteria: Record<string, unknown>,
        progress: number,
        createdAt: number,
        updatedAt: number
    ) {
        this.objectiveId = objectiveId;
        this.questId = questId;
        this.description = description;
        this.type = type;
        this.status = status;
        this.requiredFlags = requiredFlags;
        this.completionCriteria = completionCriteria;
        this.progress = progress;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromEntity(objective: Objective): ObjectiveDto {
        const requiredFlags: Record<string, unknown> = {};
        objective.getRequiredFlags().forEach((value, key) => {
            requiredFlags[key] = value;
        });

        const completionCriteria: Record<string, unknown> = {};
        objective.getCompletionCriteria().forEach((value, key) => {
            completionCriteria[key] = value;
        });

        return new ObjectiveDto(
            objective.getObjectiveId().getValue(),
            objective.getQuestId().getValue(),
            objective.getDescription(),
            objective.getType().getValue(),
            objective.getStatus().getValue(),
            requiredFlags,
            completionCriteria,
            objective.getProgress(),
            objective.getCreatedAt(),
            objective.getUpdatedAt()
        );
    }
}
