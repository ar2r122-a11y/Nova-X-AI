export class ChapterId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): ChapterId {
        if (!value || value.trim().length === 0) {
            throw new Error("ChapterId cannot be empty.");
        }
        const trimmed = value.trim();
        if (!ChapterId.UUID_REGEX.test(trimmed)) {
            throw new Error(`ChapterId must be a valid UUID: ${trimmed}`);
        }
        return new ChapterId(trimmed);
    }

    static generate(): ChapterId {
        return new ChapterId(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ChapterId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
}
