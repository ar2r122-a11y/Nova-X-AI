export type QuestStatus = "not_started" | "active" | "completed" | "failed";

export class QuestStatusRef {
    private readonly value: QuestStatus;

    private constructor(value: QuestStatus) {
        this.value = value;
    }

    static create(value: string): QuestStatusRef {
        if (!QuestStatusRef.isValid(value)) {
            throw new Error(`Invalid QuestStatus: ${value}`);
        }
        return new QuestStatusRef(value as QuestStatus);
    }

    static initial(): QuestStatusRef {
        return QuestStatusRef.create("not_started");
    }

    static notStarted(): QuestStatusRef {
        return QuestStatusRef.create("not_started");
    }

    static active(): QuestStatusRef {
        return QuestStatusRef.create("active");
    }

    static completed(): QuestStatusRef {
        return QuestStatusRef.create("completed");
    }

    static failed(): QuestStatusRef {
        return QuestStatusRef.create("failed");
    }

    getValue(): QuestStatus {
        return this.value;
    }

    equals(other: QuestStatusRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: QuestStatus[] = ["not_started", "active", "completed", "failed"];

    private static isValid(value: string): boolean {
        return QuestStatusRef.VALUES.includes(value as QuestStatus);
    }
}
