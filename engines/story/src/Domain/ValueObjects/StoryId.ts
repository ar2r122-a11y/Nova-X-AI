export class StoryId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): StoryId {
        if (!value || value.trim().length === 0) {
            throw new Error("StoryId cannot be empty.");
        }
        const trimmed = value.trim();
        if (!StoryId.UUID_REGEX.test(trimmed)) {
            throw new Error(`StoryId must be a valid UUID: ${trimmed}`);
        }
        return new StoryId(trimmed);
    }

    static generate(): StoryId {
        return new StoryId(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: StoryId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
}
