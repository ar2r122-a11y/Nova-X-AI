export class MemoryDecayRate {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(value: number): MemoryDecayRate {
        if (typeof value !== "number" || Number.isNaN(value) || value < 0.0) {
            throw new Error("Memory decay rate must be a non-negative number.");
        }
        return new MemoryDecayRate(value);
    }

    static default(): MemoryDecayRate {
        return new MemoryDecayRate(0.01);
    }

    getValue(): number {
        return this.value;
    }

    equals(other: MemoryDecayRate): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value.toFixed(4);
    }
}
