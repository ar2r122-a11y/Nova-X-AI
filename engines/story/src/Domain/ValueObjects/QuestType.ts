export type QuestType = "main" | "side" | "hidden";

export class QuestTypeRef {
    private readonly value: QuestType;

    private constructor(value: QuestType) {
        this.value = value;
    }

    static create(value: string): QuestTypeRef {
        if (!QuestTypeRef.isValid(value)) {
            throw new Error(`Invalid QuestType: ${value}`);
        }
        return new QuestTypeRef(value as QuestType);
    }

    static initial(): QuestTypeRef {
        return QuestTypeRef.create("side");
    }

    static main(): QuestTypeRef {
        return QuestTypeRef.create("main");
    }

    static side(): QuestTypeRef {
        return QuestTypeRef.create("side");
    }

    static hidden(): QuestTypeRef {
        return QuestTypeRef.create("hidden");
    }

    getValue(): QuestType {
        return this.value;
    }

    equals(other: QuestTypeRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: QuestType[] = ["main", "side", "hidden"];

    private static isValid(value: string): boolean {
        return QuestTypeRef.VALUES.includes(value as QuestType);
    }
}
