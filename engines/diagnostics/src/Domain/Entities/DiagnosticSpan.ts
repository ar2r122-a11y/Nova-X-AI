import { SpanId } from "../ValueObjects/SpanId";

export class DiagnosticSpan {
    private readonly spanId: SpanId;
    private readonly traceId: string;
    private readonly parentSpanId: string | null;
    private readonly name: string;
    private readonly startTime: number;
    private readonly endTime: number | null;
    private readonly durationMs: number | null;
    private readonly status: "ok" | "error" | "unset";
    private readonly attributes: Record<string, unknown>;
    private readonly engine: string;

    constructor(opts: {
        spanId: SpanId;
        traceId: string;
        parentSpanId: string | null;
        name: string;
        startTime: number;
        endTime: number | null;
        durationMs: number | null;
        status: "ok" | "error" | "unset";
        attributes: Record<string, unknown>;
        engine: string;
    }) {
        this.spanId = opts.spanId;
        this.traceId = opts.traceId;
        this.parentSpanId = opts.parentSpanId;
        this.name = opts.name;
        this.startTime = opts.startTime;
        this.endTime = opts.endTime;
        this.durationMs = opts.durationMs;
        this.status = opts.status;
        this.attributes = opts.attributes;
        this.engine = opts.engine;
    }

    public getSpanId(): SpanId {
        return this.spanId;
    }

    public getTraceId(): string {
        return this.traceId;
    }

    public getParentSpanId(): string | null {
        return this.parentSpanId;
    }

    public getName(): string {
        return this.name;
    }

    public getStartTime(): number {
        return this.startTime;
    }

    public getEndTime(): number | null {
        return this.endTime;
    }

    public getDurationMs(): number | null {
        return this.durationMs;
    }

    public getStatus(): "ok" | "error" | "unset" {
        return this.status;
    }

    public getAttributes(): Record<string, unknown> {
        return this.attributes;
    }

    public getEngine(): string {
        return this.engine;
    }
}
