/**
 * Nova X AI
 * AI Router
 * Domain Value Object: ProviderHealth
 *
 * Tracks the health status of an AI provider for circuit-breaker
 * and fallback/routing decisions.
 */
export enum ProviderHealthStatus {

    Healthy = "Healthy",

    Degraded = "Degraded",

    Unhealthy = "Unhealthy",

}

export class ProviderHealth {

    public readonly status: ProviderHealthStatus;

    public readonly consecutiveFailures: number;

    public readonly lastError: string | null;

    public readonly lastChecked: number;

    constructor(
        status: ProviderHealthStatus = ProviderHealthStatus.Healthy,
        consecutiveFailures: number = 0,
        lastError: string | null = null,
        lastChecked: number = Date.now()
    ) {

        this.status = status;

        this.consecutiveFailures = consecutiveFailures;

        this.lastError = lastError;

        this.lastChecked = lastChecked;

    }

    public isHealthy(): boolean {

        return this.status !== ProviderHealthStatus.Unhealthy;

    }

    public isDegraded(): boolean {

        return this.status === ProviderHealthStatus.Degraded;

    }

    public isUnhealthy(): boolean {

        return this.status === ProviderHealthStatus.Unhealthy;

    }

    public recordFailure(error: string): ProviderHealth {

        const failures = this.consecutiveFailures + 1;

        const status =
            failures >= 3
                ? ProviderHealthStatus.Unhealthy
                : failures >= 1
                ? ProviderHealthStatus.Degraded
                : this.status;

        return new ProviderHealth(
            status,
            failures,
            error,
            Date.now()
        );

    }

    public recordSuccess(): ProviderHealth {

        return new ProviderHealth(
            ProviderHealthStatus.Healthy,
            0,
            null,
            Date.now()
        );

    }

    public toDegraded(error: string): ProviderHealth {

        return new ProviderHealth(
            ProviderHealthStatus.Degraded,
            this.consecutiveFailures,
            error,
            Date.now()
        );

    }

}
