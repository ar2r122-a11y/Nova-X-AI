export class EndingId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): EndingId {
        if (!value || value.trim().length === 0) {
            throw new Error("EndingId cannot be empty.");
        }
        const trimmed = value.trim();
        if (!EndingId.UUID_REGEX.test(trimmed)) {
            throw new Error(`EndingId must be a valid UUID: ${trimmed}`);
        }
        return new EndingId(trimmed);
    }

    static generate(): EndingId {
        return new EndingId(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: EndingId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
}
