/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: RetryStrategy
 */

export class RetryStrategy {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static none(): RetryStrategy { return new RetryStrategy("none"); }
    public static linear(): RetryStrategy { return new RetryStrategy("linear"); }
    public static exponentialBackoff(): RetryStrategy { return new RetryStrategy("exponentialBackoff"); }

    public static fromString(value: string): RetryStrategy {
        const normalized = value.trim().toLowerCase();
        switch (normalized) {
            case "none": return RetryStrategy.none();
            case "linear": return RetryStrategy.linear();
            case "exponentialbackoff": return RetryStrategy.exponentialBackoff();
            default: throw new Error(`Unknown RetryStrategy: ${value}`);
        }
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: RetryStrategy): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
