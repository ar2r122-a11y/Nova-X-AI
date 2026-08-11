import { ObjectiveId } from "../ValueObjects/ObjectiveId";
import { QuestId } from "../ValueObjects/QuestId";
import { ObjectiveTypeRef } from "../ValueObjects/ObjectiveType";
import { ObjectiveStatusRef } from "../ValueObjects/ObjectiveStatus";

export interface ObjectiveProps {
    objectiveId: ObjectiveId;
    questId: QuestId;
    description: string;
    type: ObjectiveTypeRef;
    status: ObjectiveStatusRef;
    requiredFlags: Map<string, unknown>;
    completionCriteria: Map<string, unknown>;
    progress: number;
    createdAt: number;
    updatedAt: number;
}

export class Objective {
    private readonly props: ObjectiveProps;

    private constructor(props: ObjectiveProps) {
        this.props = props;
    }

    static create(
        props: Omit<ObjectiveProps, "objectiveId" | "createdAt" | "updatedAt" | "status" | "progress" | "requiredFlags" | "completionCriteria"> & {
            requiredFlags?: Map<string, unknown>;
            completionCriteria?: Map<string, unknown>;
            status?: ObjectiveStatusRef;
            progress?: number;
        }
    ): Objective {
        if (!props.description || props.description.trim().length === 0) {
            throw new Error("Objective description cannot be empty.");
        }
        const now = Date.now();
        return new Objective({
            objectiveId: ObjectiveId.generate(),
            questId: props.questId,
            description: props.description.trim(),
            type: props.type ?? ObjectiveTypeRef.initial(),
            status: props.status ?? ObjectiveStatusRef.initial(),
            requiredFlags: new Map(props.requiredFlags),
            completionCriteria: new Map(props.completionCriteria),
            progress: props.progress ?? 0,
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: ObjectiveProps): Objective {
        return new Objective(props);
    }

    getId(): ObjectiveId {
        return this.props.objectiveId;
    }

    getObjectiveId(): ObjectiveId {
        return this.props.objectiveId;
    }

    getQuestId(): QuestId {
        return this.props.questId;
    }

    getDescription(): string {
        return this.props.description;
    }

    getType(): ObjectiveTypeRef {
        return this.props.type;
    }

    getStatus(): ObjectiveStatusRef {
        return this.props.status;
    }

    getRequiredFlags(): ReadonlyMap<string, unknown> {
        return this.props.requiredFlags;
    }

    getCompletionCriteria(): ReadonlyMap<string, unknown> {
        return this.props.completionCriteria;
    }

    getProgress(): number {
        return this.props.progress;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    markActive(): void {
        this.props.status = ObjectiveStatusRef.active();
        this.props.updatedAt = Date.now();
    }

    complete(): void {
        this.props.status = ObjectiveStatusRef.completed();
        this.props.progress = 100;
        this.props.updatedAt = Date.now();
    }

    fail(): void {
        this.props.status = ObjectiveStatusRef.failed();
        this.props.updatedAt = Date.now();
    }

    setProgress(value: number): void {
        if (value < 0 || value > 100) {
            throw new Error("Objective progress must be between 0 and 100.");
        }
        this.props.progress = value;
        this.props.updatedAt = Date.now();
    }

    incrementProgress(amount: number): void {
        const current = this.props.progress;
        const next = Math.min(100, current + amount);
        this.setProgress(next);
    }

    isComplete(): boolean {
        return this.props.status.getValue() === "completed";
    }

    isFailed(): boolean {
        return this.props.status.getValue() === "failed";
    }

    toSnapshot(): Record<string, unknown> {
        const requiredFlags: Record<string, unknown> = {};
        const completionCriteria: Record<string, unknown> = {};
        this.props.requiredFlags.forEach((value, key) => {
            requiredFlags[key] = value;
        });
        this.props.completionCriteria.forEach((value, key) => {
            completionCriteria[key] = value;
        });
        return {
            objectiveId: this.props.objectiveId.getValue(),
            questId: this.props.questId.getValue(),
            description: this.props.description,
            type: this.props.type.getValue(),
            status: this.props.status.getValue(),
            requiredFlags,
            completionCriteria,
            progress: this.props.progress,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
