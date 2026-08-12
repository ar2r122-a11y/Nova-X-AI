export class RetryPolicy {
    static readonly DEFAULT_MAX_RETRIES = 3;
    static readonly DEFAULT_BACKOFF_MS = 1000;
    static readonly DEFAULT_MAX_BACKOFF_MS = 10000;

    static calculateBackoff(retryCount: number, baseMs: number = RetryPolicy.DEFAULT_BACKOFF_MS, maxMs: number = RetryPolicy.DEFAULT_MAX_BACKOFF_MS): number {
        const exponential = baseMs * Math.pow(2, retryCount);
        const jitter = Math.random() * baseMs * 0.5;
        return Math.min(exponential + jitter, maxMs);
    }

    static canRetry(retryCount: number, maxRetries: number = RetryPolicy.DEFAULT_MAX_RETRIES): boolean {
        return retryCount < maxRetries;
    }
}
