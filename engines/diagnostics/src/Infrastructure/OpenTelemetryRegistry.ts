import type { IOpenTelemetryAdapter } from "../Domain/Services/IOpenTelemetryAdapter";
import type { SpanId } from "../Domain/ValueObjects/SpanId";

export class OpenTelemetryRegistry implements IOpenTelemetryAdapter {
    private readonly spans = new Map<string, {
        spanId: string;
        traceId: string;
        name: string;
        startTime: number;
        endTime: number | null;
        durationMs: number | null;
        status: "ok" | "error" | "unset";
        attributes: Record<string, unknown>;
        engine: string;
    }>();

    private readonly activeSpanCount = { value: 0 };

    public async startSpan(name: string, traceId: string, parentSpanId?: string): Promise<{
        spanId: string;
        traceId: string;
        startTime: number;
    }> {
        const spanId = `span-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const startTime = Date.now();

        this.spans.set(spanId, {
            spanId,
            traceId,
            name,
            startTime,
            endTime: null,
            durationMs: null,
            status: "unset",
            attributes: parentSpanId ? { parentSpanId } : {},
            engine: "unknown"
        });

        this.activeSpanCount.value++;
        return { spanId, traceId, startTime };
    }

    public async endSpan(spanId: string, traceId: string, status: "ok" | "error", attributes?: Record<string, unknown>): Promise<void> {
        const span = this.spans.get(spanId);
        if (!span) {
            return;
        }

        const endTime = Date.now();
        span.endTime = endTime;
        span.durationMs = endTime - span.startTime;
        span.status = status;
        if (attributes) {
            span.attributes = { ...span.attributes, ...attributes };
        }

        this.activeSpanCount.value = Math.max(0, this.activeSpanCount.value - 1);
    }

    public async getActiveSpanCount(): Promise<number> {
        return this.activeSpanCount.value;
    }

    public async exportSpans(): Promise<Array<{
        spanId: string;
        traceId: string;
        name: string;
        startTime: number;
        endTime: number | null;
        durationMs: number | null;
        status: string;
        attributes: Record<string, unknown>;
        engine: string;
    }>> {
        return Array.from(this.spans.values());
    }

    public async clear(): Promise<void> {
        this.spans.clear();
        this.activeSpanCount.value = 0;
    }

    public setEngine(spanId: string, engine: string): void {
        const span = this.spans.get(spanId);
        if (span) {
            span.engine = engine;
        }
    }
}
