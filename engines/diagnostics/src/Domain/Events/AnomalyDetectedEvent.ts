import type { IDomainEvent } from "@nova-x-ai/core";

export class AnomalyDetectedEvent implements IDomainEvent {
    public readonly eventType = "EVT_DIAG_AnomalyDetected";

    public readonly timestamp: number;
    public readonly correlationId: string;
    public readonly engineName: string;
    public readonly anomalyType: string;
    public readonly severity: "low" | "medium" | "high" | "critical";
    public readonly message: string;
    public readonly context: Record<string, unknown>;

    constructor(opts: {
        engineName: string;
        anomalyType: string;
        severity: "low" | "medium" | "high" | "critical";
        message: string;
        context: Record<string, unknown>;
        correlationId: string;
        timestamp?: number;
    }) {
        this.engineName = opts.engineName;
        this.anomalyType = opts.anomalyType;
        this.severity = opts.severity;
        this.message = opts.message;
        this.context = opts.context;
        this.correlationId = opts.correlationId;
        this.timestamp = opts.timestamp ?? Date.now();
    }
}
