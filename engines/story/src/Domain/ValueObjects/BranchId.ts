export class BranchId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): BranchId {
        if (!value || value.trim().length === 0) {
            throw new Error("BranchId cannot be empty.");
        }
        const trimmed = value.trim();
        if (!BranchId.UUID_REGEX.test(trimmed)) {
            throw new Error(`BranchId must be a valid UUID: ${trimmed}`);
        }
        return new BranchId(trimmed);
    }

    static generate(): BranchId {
        return new BranchId(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: BranchId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
}
