export interface ICircuitBreaker {
    execute<T>(operation: () => Promise<T>, fallback: () => Promise<T>): Promise<T>;
}

type CircuitState = "Closed" | "Open" | "HalfOpen";

export class CircuitBreaker implements ICircuitBreaker {
    private state: CircuitState = "Closed";
    private failureCount = 0;
    private readonly failureThreshold: number;
    private readonly recoveryTimeoutMs: number;
    private lastFailureTime = 0;

    constructor(failureThreshold = 5, recoveryTimeoutMs = 30000) {
        this.failureThreshold = failureThreshold;
        this.recoveryTimeoutMs = recoveryTimeoutMs;
    }

    async execute<T>(operation: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
        if (this.state === "Open") {
            if (Date.now() - this.lastFailureTime >= this.recoveryTimeoutMs) {
                this.state = "HalfOpen";
            } else {
                return fallback();
            }
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            return fallback();
        }
    }

    getState(): CircuitState {
        return this.state;
    }

    getFailureCount(): number {
        return this.failureCount;
    }

    private onSuccess(): void {
        this.failureCount = 0;
        this.state = "Closed";
    }

    private onFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.failureThreshold) {
            this.state = "Open";
        }
    }
}
