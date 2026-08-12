
export class RetryPolicy {
    private readonly maxRetries: number;
    private readonly backoffMs: number;

    constructor(maxRetries: number = 3, backoffMs: number = 1000) {
        this.maxRetries = maxRetries;
        this.backoffMs = backoffMs;
    }

    shouldRetry(attempt: number): boolean {
        return attempt < this.maxRetries;
    }

    getDelay(attempt: number): number {
        return this.backoffMs * Math.pow(2, attempt);
    }

    getMaxRetries(): number {
        return this.maxRetries;
    }
}
