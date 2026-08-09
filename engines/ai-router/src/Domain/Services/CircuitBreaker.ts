/**
 * Nova X AI
 * AI Router
 * Domain Service: CircuitBreaker
 *
 * Implements circuit-breaker behavior for provider health/failure handling.
 * Open → half-open → closed state transitions.
 *
 * SDS: Provider health/failure handling, retry/circuit-breaker behavior.
 */
import { ProviderHealth } from "../ValueObjects/ProviderHealth";

export enum CircuitState {

    Closed = "Closed",

    Open = "Open",

    HalfOpen = "HalfOpen",

}

export interface CircuitBreakerConfig {

    readonly failureThreshold: number;

    readonly recoveryTimeoutMs: number;

    readonly halfOpenAttempts: number;

}

export class CircuitBreaker {

    private state: CircuitState = CircuitState.Closed;

    private failureCount = 0;

    private lastFailureTime = 0;

    private halfOpenAttempts = 0;

    private readonly config: CircuitBreakerConfig;

    private health: ProviderHealth = new ProviderHealth();

    constructor(config?: Partial<CircuitBreakerConfig>) {

        this.config = {

            failureThreshold: config?.failureThreshold ?? 5,

            recoveryTimeoutMs: config?.recoveryTimeoutMs ?? 30000,

            halfOpenAttempts: config?.halfOpenAttempts ?? 3

        };

    }

    public getHealth(): ProviderHealth {

        return this.health;

    }

    public getState(): CircuitState {

        return this.state;

    }

    public getFailureCount(): number {

        return this.failureCount;

    }

    public canExecute(): boolean {

        if (this.state === CircuitState.Closed) {

            return true;

        }

        if (this.state === CircuitState.Open) {

            const elapsed =
                Date.now() - this.lastFailureTime;

            if (elapsed >= this.config.recoveryTimeoutMs) {

                this.state = CircuitState.HalfOpen;

                this.halfOpenAttempts = 0;

                return true;

            }

            return false;

        }

        // HalfOpen — allow up to halfOpenAttempts
        if (
            this.halfOpenAttempts <
            this.config.halfOpenAttempts
        ) {

            this.halfOpenAttempts++;

            return true;

        }

        return false;

    }

    public recordSuccess(): void {

        this.failureCount = 0;

        if (this.state !== CircuitState.Closed) {

            this.state = CircuitState.Closed;

        }

        this.health = this.health.recordSuccess();

    }

    public recordFailure(error: string): void {

        this.failureCount++;

        this.lastFailureTime = Date.now();

        this.health = this.health.recordFailure(error);

        if (this.failureCount >= this.config.failureThreshold) {

            this.state = CircuitState.Open;

        } else if (this.state === CircuitState.Closed) {

            this.state = CircuitState.HalfOpen;

        }

    }

    public reset(): void {

        this.state = CircuitState.Closed;

        this.failureCount = 0;

        this.halfOpenAttempts = 0;

        this.health = new ProviderHealth();

    }

    public trip(): void {

        this.state = CircuitState.Open;

        this.lastFailureTime = Date.now();

    }

    public isTripRequired(): boolean {

        return (
            this.state === CircuitState.Open &&
            this.failureCount >=
                this.config.failureThreshold
        );

    }

}
