export class ObjectiveId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): ObjectiveId {
        if (!value || value.trim().length === 0) {
            throw new Error("ObjectiveId cannot be empty.");
        }
        const trimmed = value.trim();
        if (!ObjectiveId.UUID_REGEX.test(trimmed)) {
            throw new Error(`ObjectiveId must be a valid UUID: ${trimmed}`);
        }
        return new ObjectiveId(trimmed);
    }

    static generate(): ObjectiveId {
        return new ObjectiveId(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ObjectiveId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
}
