import type { IDomainEvent } from "@nova-x-ai/core";

export class HealthProbeCompletedEvent implements IDomainEvent {
    public readonly eventType = "EVT_DIAG_HealthProbeCompleted";

    public readonly timestamp: number;
    public readonly correlationId: string;
    public readonly engineName: string;
    public readonly healthy: boolean;
    public readonly durationMs: number;
    public readonly message: string | null;

    constructor(opts: {
        engineName: string;
        healthy: boolean;
        durationMs: number;
        message: string | null;
        correlationId: string;
        timestamp?: number;
    }) {
        this.engineName = opts.engineName;
        this.healthy = opts.healthy;
        this.durationMs = opts.durationMs;
        this.message = opts.message;
        this.correlationId = opts.correlationId;
        this.timestamp = opts.timestamp ?? Date.now();
    }
}
