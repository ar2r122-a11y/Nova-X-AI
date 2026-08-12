/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: TokenCount
 */

export class TokenCount {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): TokenCount {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("TokenCount must be a non-negative integer.");
        }
        return new TokenCount(value);
    }

    public static zero(): TokenCount {
        return new TokenCount(0);
    }

    public getValue(): number {
        return this.value;
    }

    public add(other: TokenCount): TokenCount {
        return new TokenCount(this.value + other.value);
    }

    public subtract(other: TokenCount): TokenCount {
        const result = this.value - other.value;
        if (result < 0) {
            throw new Error("TokenCount subtraction resulted in negative value.");
        }
        return new TokenCount(result);
    }

    public isGreaterThan(other: TokenCount): boolean {
        return this.value > other.value;
    }

    public isLessThan(other: TokenCount): boolean {
        return this.value < other.value;
    }

    public isGreaterThanOrEqual(other: TokenCount): boolean {
        return this.value >= other.value;
    }

    public isLessThanOrEqual(other: TokenCount): boolean {
        return this.value <= other.value;
    }

    public equals(other: TokenCount): boolean {
        return this.value === other.value;
    }
}
