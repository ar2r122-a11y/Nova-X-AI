import type { IDomainEvent } from "@nova-x-ai/core";

export class DiagnosticsRecoveryEvent implements IDomainEvent {
    public readonly eventType = "EVT_DIAG_Recovery";

    public readonly timestamp: number;
    public readonly correlationId: string;
    public readonly engine: string;
    public readonly action: string;

    constructor(opts: {
        engine: string;
        action: string;
        correlationId: string;
        timestamp?: number;
    }) {
        this.engine = opts.engine;
        this.action = opts.action;
        this.correlationId = opts.correlationId;
        this.timestamp = opts.timestamp ?? Date.now();
    }
}
