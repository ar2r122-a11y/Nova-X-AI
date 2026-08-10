export enum CircuitBreakerState {
    Closed = "closed",
    Open = "open",
    HalfOpen = "halfOpen"
}

export interface CircuitBreakerOptions {
    readonly failureThreshold: number;
    readonly recoveryTimeoutMs: number;
    readonly halfOpenMaxCalls: number;
}

export class CircuitBreaker {
    private state: CircuitBreakerState = CircuitBreakerState.Closed;
    private failureCount = 0;
    private lastFailureTime = 0;
    private halfOpenCalls = 0;

    constructor(private readonly options: CircuitBreakerOptions) {}

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === CircuitBreakerState.Open) {
            if (Date.now() - this.lastFailureTime >= this.options.recoveryTimeoutMs) {
                this.state = CircuitBreakerState.HalfOpen;
                this.halfOpenCalls = 0;
            } else {
                throw new Error("Circuit breaker is open.");
            }
        }

        if (this.state === CircuitBreakerState.HalfOpen) {
            if (this.halfOpenCalls >= this.options.halfOpenMaxCalls) {
                throw new Error("Circuit breaker is half-open and at max calls.");
            }
            this.halfOpenCalls++;
        }

        try {
            const result = await fn();
            this.recordSuccess();
            return result;
        } catch (error) {
            this.recordFailure();
            throw error;
        }
    }

    recordSuccess(): void {
        this.failureCount = 0;
        this.halfOpenCalls = 0;
        this.state = CircuitBreakerState.Closed;
    }

    recordFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.options.failureThreshold) {
            this.state = CircuitBreakerState.Open;
        }
    }

    getState(): CircuitBreakerState {
        return this.state;
    }
}
