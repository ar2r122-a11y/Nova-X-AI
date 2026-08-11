import { BranchId } from "../ValueObjects/BranchId";
import { StoryId } from "../ValueObjects/StoryId";
import { SceneId } from "../ValueObjects/SceneId";
import { BranchCondition } from "../ValueObjects/BranchCondition";
import { NarrativePriorityRef } from "../ValueObjects/NarrativePriority";

export interface BranchProps {
    branchId: BranchId;
    storyId: StoryId;
    sourceSceneId: SceneId;
    targetSceneId: SceneId;
    condition: BranchCondition;
    priority: NarrativePriorityRef;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
}

export class Branch {
    private readonly props: BranchProps;

    private constructor(props: BranchProps) {
        this.props = props;
    }

    static create(
        props: Omit<BranchProps, "branchId" | "createdAt" | "updatedAt" | "isActive" | "condition" | "priority"> & {
            condition?: BranchCondition;
            priority?: NarrativePriorityRef;
            isActive?: boolean;
        }
    ): Branch {
        const now = Date.now();
        return new Branch({
            branchId: BranchId.generate(),
            storyId: props.storyId,
            sourceSceneId: props.sourceSceneId,
            targetSceneId: props.targetSceneId,
            condition: props.condition ?? BranchCondition.always(),
            priority: props.priority ?? NarrativePriorityRef.initial(),
            isActive: props.isActive ?? true,
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: BranchProps): Branch {
        return new Branch(props);
    }

    getBranchId(): BranchId {
        return this.props.branchId;
    }

    getStoryId(): StoryId {
        return this.props.storyId;
    }

    getSourceSceneId(): SceneId {
        return this.props.sourceSceneId;
    }

    getTargetSceneId(): SceneId {
        return this.props.targetSceneId;
    }

    getCondition(): BranchCondition {
        return this.props.condition;
    }

    getPriority(): NarrativePriorityRef {
        return this.props.priority;
    }

    isActive(): boolean {
        return this.props.isActive;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    activate(): void {
        this.props.isActive = true;
        this.props.updatedAt = Date.now();
    }

    deactivate(): void {
        this.props.isActive = false;
        this.props.updatedAt = Date.now();
    }

    setCondition(condition: BranchCondition): void {
        this.props.condition = condition;
        this.props.updatedAt = Date.now();
    }

    setPriority(priority: NarrativePriorityRef): void {
        this.props.priority = priority;
        this.props.updatedAt = Date.now();
    }

    toSnapshot(): Record<string, unknown> {
        return {
            branchId: this.props.branchId.getValue(),
            storyId: this.props.storyId.getValue(),
            sourceSceneId: this.props.sourceSceneId.getValue(),
            targetSceneId: this.props.targetSceneId.getValue(),
            condition: this.props.condition.getValue(),
            priority: this.props.priority.getValue(),
            isActive: this.props.isActive,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
