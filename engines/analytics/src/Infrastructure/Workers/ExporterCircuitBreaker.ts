export class ExporterCircuitBreaker {
    private failures = 0;
    private lastFailureTime = 0;
    private readonly threshold: number;
    private readonly resetTimeoutMs: number;
    private state: "closed" | "open" | "half-open" = "closed";

    constructor(threshold: number = 5, resetTimeoutMs: number = 30000) {
        this.threshold = threshold;
        this.resetTimeoutMs = resetTimeoutMs;
    }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === "open") {
            if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
                this.state = "half-open";
            } else {
                throw new Error("Circuit breaker is open. Exporter is temporarily unavailable.");
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        this.failures = 0;
        this.state = "closed";
    }

    private onFailure(): void {
        this.failures += 1;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.threshold) {
            this.state = "open";
        }
    }

    getState(): string {
        return this.state;
    }
}
