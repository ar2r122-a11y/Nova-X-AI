import { QuestStatusRef } from "./QuestStatus";

export interface BranchConditionProps {
    conditionType: string;
    requiredFlags: Record<string, unknown>;
    requiredQuestStatus: Map<string, QuestStatusRef>;
    requiredChapterProgress: number;
}

export class BranchCondition {
    private readonly props: BranchConditionProps;

    private constructor(props: BranchConditionProps) {
        this.props = props;
    }

    static create(
        conditionType: string,
        requiredFlags: Record<string, unknown>,
        requiredQuestStatus: Map<string, QuestStatusRef>,
        requiredChapterProgress: number
    ): BranchCondition {
        if (!conditionType || conditionType.trim().length === 0) {
            throw new Error("BranchCondition conditionType cannot be empty.");
        }
        if (requiredChapterProgress < 0) {
            throw new Error("BranchCondition requiredChapterProgress cannot be negative.");
        }
        return new BranchCondition({
            conditionType: conditionType.trim(),
            requiredFlags: { ...requiredFlags },
            requiredQuestStatus: new Map(requiredQuestStatus),
            requiredChapterProgress,
        });
    }

    static always(): BranchCondition {
        return BranchCondition.create("always", {}, new Map(), 0);
    }

    getConditionType(): string {
        return this.props.conditionType;
    }

    getRequiredFlagsRecord(): Readonly<Record<string, unknown>> {
        return this.props.requiredFlags;
    }

    getRequiredQuestStatus(): ReadonlyMap<string, QuestStatusRef> {
        return this.props.requiredQuestStatus;
    }

    getRequiredChapterProgress(): number {
        return this.props.requiredChapterProgress;
    }

    getValue(): string {
        const questStatusObj: Record<string, string> = {};
        this.props.requiredQuestStatus.forEach((status, questId) => {
            questStatusObj[questId] = status.getValue();
        });
        return JSON.stringify({
            conditionType: this.props.conditionType,
            requiredFlags: this.props.requiredFlags,
            requiredQuestStatus: questStatusObj,
            requiredChapterProgress: this.props.requiredChapterProgress,
        });
    }

    equals(other: BranchCondition): boolean {
        return this.getValue() === other.getValue();
    }

    toString(): string {
        return this.props.conditionType;
    }
}
