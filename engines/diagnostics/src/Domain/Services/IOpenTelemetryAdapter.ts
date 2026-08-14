export interface IOpenTelemetryAdapter {
    startSpan(name: string, traceId: string, parentSpanId?: string): Promise<{
        spanId: string;
        traceId: string;
        startTime: number;
    }>;

    endSpan(spanId: string, traceId: string, status: "ok" | "error", attributes?: Record<string, unknown>): Promise<void>;

    getActiveSpanCount(): Promise<number>;

    exportSpans(): Promise<Array<{
        spanId: string;
        traceId: string;
        name: string;
        startTime: number;
        endTime: number | null;
        durationMs: number | null;
        status: string;
        attributes: Record<string, unknown>;
        engine: string;
    }>>;

    clear(): Promise<void>;
}
