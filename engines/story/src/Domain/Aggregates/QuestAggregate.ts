import { IDomainEvent } from "@nova-x-ai/core";
import { QuestId } from "../ValueObjects/QuestId";
import { StoryId } from "../ValueObjects/StoryId";
import { QuestTypeRef } from "../ValueObjects/QuestType";
import { QuestStatusRef } from "../ValueObjects/QuestStatus";
import { StoryVersion } from "../ValueObjects/StoryVersion";
import { ObjectiveId } from "../ValueObjects/ObjectiveId";
import { Objective } from "../Entities/Objective";
import { QuestUpdatedEvent } from "../Events";

export interface QuestAggregateProps {
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
    version: StoryVersion;
    createdAt: number;
    updatedAt: number;
}

export class QuestAggregate {
    private readonly props: QuestAggregateProps;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(props: QuestAggregateProps) {
        this.props = props;
        this.uncommittedEvents = [];
    }

    static create(
        questId: QuestId,
        storyId: StoryId,
        title: string,
        description: string,
        type: QuestTypeRef
    ): QuestAggregate {
        const now = Date.now();
        return new QuestAggregate({
            questId,
            storyId,
            title,
            description: description ?? "",
            type,
            status: QuestStatusRef.initial(),
            objectives: [],
            rewards: new Map(),
            prerequisites: [],
            narrativeFlags: new Map(),
            version: StoryVersion.initial(),
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: QuestAggregateProps): QuestAggregate {
        return new QuestAggregate({
            ...props,
            rewards: new Map(props.rewards),
            narrativeFlags: new Map(props.narrativeFlags),
        });
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

    getVersion(): StoryVersion {
        return this.props.version;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    activate(): void {
        if (this.props.status.getValue() !== "not_started") {
            throw new Error(`Quest can only be activated from not_started. Current: ${this.props.status.getValue()}`);
        }
        this.props.status = QuestStatusRef.active();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    updateObjectiveProgress(objectiveId: ObjectiveId, progress: number): void {
        const objective = this.props.objectives.find((o) => o.getObjectiveId().equals(objectiveId));
        if (!objective) {
            throw new Error(`Objective not found: ${objectiveId.getValue()}`);
        }
        objective.setProgress(progress);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    completeObjective(objectiveId: ObjectiveId): void {
        const objective = this.props.objectives.find((o) => o.getObjectiveId().equals(objectiveId));
        if (!objective) {
            throw new Error(`Objective not found: ${objectiveId.getValue()}`);
        }
        objective.complete();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    failObjective(objectiveId: ObjectiveId, reason: string): void {
        const objective = this.props.objectives.find((o) => o.getObjectiveId().equals(objectiveId));
        if (!objective) {
            throw new Error(`Objective not found: ${objectiveId.getValue()}`);
        }
        objective.fail();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    complete(): void {
        if (this.props.status.getValue() !== "active") {
            throw new Error(`Quest can only be completed from active. Current: ${this.props.status.getValue()}`);
        }

        const required = this.props.objectives.filter((o) => o.getType().getValue() === "required");
        const allComplete = required.length === 0 || required.every((o) => o.isComplete() && !o.isFailed());
        if (!allComplete) {
            throw new Error("Quest cannot be completed: not all required objectives are complete.");
        }

        this.props.status = QuestStatusRef.completed();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();

        this.uncommittedEvents.push(new QuestUpdatedEvent(
            this.props.storyId.getValue(),
            this.props.questId.getValue(),
            "completed",
            this.getProgress(),
            Date.now(),
            ""
        ));
    }

    fail(reason: string): void {
        if (this.props.status.getValue() !== "active") {
            throw new Error(`Quest can only be failed from active. Current: ${this.props.status.getValue()}`);
        }

        this.props.status = QuestStatusRef.failed();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();

        this.uncommittedEvents.push(new QuestUpdatedEvent(
            this.props.storyId.getValue(),
            this.props.questId.getValue(),
            "failed",
            this.getProgress(),
            Date.now(),
            ""
        ));
    }

    addObjective(objective: Objective): void {
        if (this.props.objectives.some((o) => o.getObjectiveId().equals(objective.getObjectiveId()))) {
            throw new Error(`Objective already exists: ${objective.getObjectiveId().getValue()}`);
        }
        this.props.objectives.push(objective);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    getProgress(): number {
        const required = this.props.objectives.filter((o) => o.getType().getValue() === "required");
        if (required.length === 0) {
            return 0;
        }
        const completed = required.filter((o) => o.isComplete() && !o.isFailed()).length;
        return Math.round((completed / required.length) * 100);
    }

    getRequiredObjectives(): Objective[] {
        return this.props.objectives.filter((o) => o.getType().getValue() === "required");
    }

    canComplete(): boolean {
        const required = this.getRequiredObjectives();
        if (required.length === 0) {
            return false;
        }
        return required.every((o) => o.isComplete() && !o.isFailed());
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): Record<string, unknown> {
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
            version: this.props.version.getValue(),
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
