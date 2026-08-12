/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: PriorityLevel
 */

export class PriorityLevel {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static low(): PriorityLevel { return new PriorityLevel(1); }
    public static normal(): PriorityLevel { return new PriorityLevel(2); }
    public static high(): PriorityLevel { return new PriorityLevel(3); }
    public static critical(): PriorityLevel { return new PriorityLevel(4); }

    public static create(value: number): PriorityLevel {
        if (!Number.isInteger(value) || value < 1 || value > 4) {
            throw new Error("PriorityLevel must be an integer between 1 and 4.");
        }
        return new PriorityLevel(value);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: PriorityLevel): boolean {
        return this.value === other.value;
    }

    public isHigherThan(other: PriorityLevel): boolean {
        return this.value > other.value;
    }
}
