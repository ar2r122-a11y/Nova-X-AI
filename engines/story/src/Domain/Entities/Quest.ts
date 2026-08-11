import { QuestId } from "../ValueObjects/QuestId";
import { StoryId } from "../ValueObjects/StoryId";
import { QuestTypeRef } from "../ValueObjects/QuestType";
import { QuestStatusRef } from "../ValueObjects/QuestStatus";
import { ObjectiveId } from "../ValueObjects/ObjectiveId";
import { Objective } from "./Objective";

export interface QuestProps {
    questId: QuestId;
    storyId: StoryId;
    title: string;
    description: string;
    type: QuestTypeRef;
    status: QuestStatusRef;
    objectives: Objective[];
    rewards: Map<string, unknown>;
    prerequisites: string[];
    narrativeFlags: Map<string, unknown>;
    createdAt: number;
    updatedAt: number;
}

export class Quest {
    private readonly props: QuestProps;

    private constructor(props: QuestProps) {
        this.props = props;
    }

    static create(
        props: Omit<QuestProps, "questId" | "createdAt" | "updatedAt" | "status" | "objectives" | "rewards" | "narrativeFlags"> & {
            objectives?: Objective[];
            rewards?: Map<string, unknown>;
            narrativeFlags?: Map<string, unknown>;
            status?: QuestStatusRef;
        }
    ): Quest {
        if (!props.title || props.title.trim().length === 0) {
            throw new Error("Quest title cannot be empty.");
        }
        const now = Date.now();
        return new Quest({
            questId: QuestId.generate(),
            storyId: props.storyId,
            title: props.title.trim(),
            description: props.description ?? "",
            type: props.type ?? QuestTypeRef.initial(),
            status: props.status ?? QuestStatusRef.initial(),
            objectives: [...(props.objectives ?? [])],
            rewards: new Map(props.rewards),
            prerequisites: [...(props.prerequisites ?? [])],
            narrativeFlags: new Map(props.narrativeFlags),
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: QuestProps): Quest {
        return new Quest(props);
    }

    getId(): QuestId {
        return this.props.questId;
    }

    getQuestId(): QuestId {
        return this.props.questId;
    }

    getStoryId(): StoryId {
        return this.props.storyId;
    }

    getTitle(): string {
        return this.props.title;
    }

    getDescription(): string {
        return this.props.description;
    }

    getType(): QuestTypeRef {
        return this.props.type;
    }

    getStatus(): QuestStatusRef {
        return this.props.status;
    }

    getObjectives(): readonly Objective[] {
        return this.props.objectives;
    }

    getRewards(): ReadonlyMap<string, unknown> {
        return this.props.rewards;
    }

    getPrerequisites(): readonly string[] {
        return this.props.prerequisites;
    }

    getNarrativeFlags(): ReadonlyMap<string, unknown> {
        return this.props.narrativeFlags;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    activate(): void {
        if (this.props.status.getValue() !== "not_started") {
            throw new Error("Quest can only be activated from not_started.");
        }
        this.props.status = QuestStatusRef.active();
        this.props.updatedAt = Date.now();
    }

    markCompleted(): void {
        this.props.status = QuestStatusRef.completed();
        this.props.updatedAt = Date.now();
    }

    markFailed(): void {
        this.props.status = QuestStatusRef.failed();
        this.props.updatedAt = Date.now();
    }

    addObjective(objective: Objective): void {
        if (this.props.objectives.some((o) => o.getId().equals(objective.getId()))) {
            throw new Error(`Objective already exists in quest: ${objective.getId().getValue()}`);
        }
        this.props.objectives.push(objective);
        this.props.updatedAt = Date.now();
    }

    getObjective(objectiveId: ObjectiveId): Objective | undefined {
        return this.props.objectives.find((o) => o.getId().equals(objectiveId));
    }

    getProgress(): number {
        if (this.props.objectives.length === 0) {
            return 0;
        }
        let completed = 0;
        for (const objective of this.props.objectives) {
            if (objective.isComplete()) {
                completed++;
            }
        }
        return Math.round((completed / this.props.objectives.length) * 100);
    }

    getRequiredObjectives(): Objective[] {
        return this.props.objectives.filter(
            (o) => o.getType().getValue() === "required"
        );
    }

    canComplete(): boolean {
        const required = this.getRequiredObjectives();
        if (required.length === 0) {
            return false;
        }
        return required.every((o) => o.isComplete() && !o.isFailed());
    }

    toSnapshot(): Record<string, unknown> {
        const rewards: Record<string, unknown> = {};
        const narrativeFlags: Record<string, unknown> = {};
        this.props.rewards.forEach((value, key) => {
            rewards[key] = value;
        });
        this.props.narrativeFlags.forEach((value, key) => {
            narrativeFlags[key] = value;
        });
        return {
            questId: this.props.questId.getValue(),
            storyId: this.props.storyId.getValue(),
            title: this.props.title,
            description: this.props.description,
            type: this.props.type.getValue(),
            status: this.props.status.getValue(),
            objectives: this.props.objectives.map((o) => o.toSnapshot()),
            rewards,
            prerequisites: this.props.prerequisites,
            narrativeFlags,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
