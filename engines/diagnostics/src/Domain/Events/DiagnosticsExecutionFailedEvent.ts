import type { IDomainEvent } from "@nova-x-ai/core";

export class DiagnosticsExecutionFailedEvent implements IDomainEvent {
    public readonly eventType = "EVT_DIAG_ExecutionFailed";

    public readonly timestamp: number;
    public readonly correlationId: string;
    public readonly engine: string;
    public readonly reason: string;

    constructor(opts: {
        engine: string;
        reason: string;
        correlationId: string;
        timestamp?: number;
    }) {
        this.engine = opts.engine;
        this.reason = opts.reason;
        this.correlationId = opts.correlationId;
        this.timestamp = opts.timestamp ?? Date.now();
    }
}
