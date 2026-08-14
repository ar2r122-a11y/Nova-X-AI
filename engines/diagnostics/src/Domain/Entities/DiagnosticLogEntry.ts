import type { DiagnosticId } from "../ValueObjects/DiagnosticId";
import type { SpanId } from "../ValueObjects/SpanId";
import type { MetricSampleId } from "../ValueObjects/MetricSampleId";

export class DiagnosticLogEntry {
    private readonly id: string;
    private readonly level: "info" | "warn" | "error" | "debug";
    private readonly message: string;
    private readonly engine: string;
    private readonly correlationId: string | null;
    private readonly metadata: Record<string, unknown>;
    private readonly timestamp: number;

    constructor(opts: {
        id: string;
        level: "info" | "warn" | "error" | "debug";
        message: string;
        engine: string;
        correlationId: string | null;
        metadata: Record<string, unknown>;
        timestamp: number;
    }) {
        this.id = opts.id;
        this.level = opts.level;
        this.message = opts.message;
        this.engine = opts.engine;
        this.correlationId = opts.correlationId;
        this.metadata = opts.metadata;
        this.timestamp = opts.timestamp;
    }

    public getId(): string {
        return this.id;
    }

    public getLevel(): "info" | "warn" | "error" | "debug" {
        return this.level;
    }

    public getMessage(): string {
        return this.message;
    }

    public getEngine(): string {
        return this.engine;
    }

    public getCorrelationId(): string | null {
        return this.correlationId;
    }

    public getMetadata(): Record<string, unknown> {
        return this.metadata;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }
}
