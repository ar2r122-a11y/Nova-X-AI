export class MemoryId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): MemoryId {
        if (!value || value.trim().length === 0) {
            throw new Error("MemoryId cannot be empty.");
        }
        return new MemoryId(value.trim());
    }

    static generate(): MemoryId {
        return new MemoryId(`mem-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: MemoryId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
