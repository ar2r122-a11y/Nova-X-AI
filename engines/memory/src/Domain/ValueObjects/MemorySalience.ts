export class MemorySalience {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(value: number): MemorySalience {
        if (typeof value !== "number" || Number.isNaN(value)) {
            throw new Error("Memory salience must be a valid number.");
        }
        const clamped = Math.max(0.0, Math.min(1.0, value));
        return new MemorySalience(clamped);
    }

    static zero(): MemorySalience {
        return new MemorySalience(0.0);
    }

    static full(): MemorySalience {
        return new MemorySalience(1.0);
    }

    getValue(): number {
        return this.value;
    }

    equals(other: MemorySalience): boolean {
        return this.value === other.value;
    }

    isAbove(threshold: number): boolean {
        return this.value > threshold;
    }

    isBelow(threshold: number): boolean {
        return this.value < threshold;
    }

    decay(rate: number): MemorySalience {
        const decayed = Math.max(0.0, this.value - rate);
        return new MemorySalience(decayed);
    }

    boost(amount: number): MemorySalience {
        const boosted = Math.min(1.0, this.value + amount);
        return new MemorySalience(boosted);
    }

    toString(): string {
        return this.value.toFixed(2);
    }
}
