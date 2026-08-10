export class MemoryClusterId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): MemoryClusterId {
        if (!value || value.trim().length === 0) {
            throw new Error("MemoryClusterId cannot be empty.");
        }
        return new MemoryClusterId(value.trim());
    }

    static generate(): MemoryClusterId {
        return new MemoryClusterId(`cluster-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: MemoryClusterId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
