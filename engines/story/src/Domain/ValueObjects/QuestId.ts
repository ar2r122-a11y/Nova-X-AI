export class QuestId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): QuestId {
        if (!value || value.trim().length === 0) {
            throw new Error("QuestId cannot be empty.");
        }
        const trimmed = value.trim();
        if (!QuestId.UUID_REGEX.test(trimmed)) {
            throw new Error(`QuestId must be a valid UUID: ${trimmed}`);
        }
        return new QuestId(trimmed);
    }

    static generate(): QuestId {
        return new QuestId(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: QuestId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
}
