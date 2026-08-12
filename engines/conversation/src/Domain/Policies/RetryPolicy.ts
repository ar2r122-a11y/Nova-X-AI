import { RetryStrategy } from "../ValueObjects/RetryStrategy";

export class RetryPolicy {
    private readonly maxRetries: number;
    private readonly strategy: RetryStrategy;
    private readonly baseDelayMs: number;

    public constructor(
        maxRetries: number = 3,
        strategy: RetryStrategy = RetryStrategy.exponentialBackoff(),
        baseDelayMs: number = 1000
    ) {
        this.maxRetries = maxRetries;
        this.strategy = strategy;
        this.baseDelayMs = baseDelayMs;
    }

    public shouldRetry(currentAttempt: number): boolean {
        return currentAttempt < this.maxRetries;
    }

    public getDelayMs(currentAttempt: number): number {
        if (this.strategy.equals(RetryStrategy.none())) {
            return 0;
        }
        if (this.strategy.equals(RetryStrategy.linear())) {
            return this.baseDelayMs * (currentAttempt + 1);
        }
        return this.baseDelayMs * Math.pow(2, currentAttempt);
    }

    public getMaxRetries(): number {
        return this.maxRetries;
    }
}
