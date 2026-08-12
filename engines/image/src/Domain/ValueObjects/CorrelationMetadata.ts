
export interface CorrelationMetadataProps {
    correlationId: string;
    requestId: string;
    sessionId: string;
    traceId: string;
    spanId: string;
    schemaVersion: string;
}

export class CorrelationMetadata {
    private readonly correlationId: string;
    private readonly requestId: string;
    private readonly sessionId: string;
    private readonly traceId: string;
    private readonly spanId: string;
    private readonly schemaVersion: string;

    private constructor(props: CorrelationMetadataProps) {
        this.correlationId = props.correlationId;
        this.requestId = props.requestId;
        this.sessionId = props.sessionId;
        this.traceId = props.traceId;
        this.spanId = props.spanId;
        this.schemaVersion = props.schemaVersion;
    }

    public static create(props: CorrelationMetadataProps): CorrelationMetadata {
        if (!props.correlationId || props.correlationId.trim().length === 0) {
            throw new Error("CorrelationId cannot be empty.");
        }
        if (!props.requestId || props.requestId.trim().length === 0) {
            throw new Error("RequestId cannot be empty.");
        }
        if (!props.sessionId || props.sessionId.trim().length === 0) {
            throw new Error("SessionId cannot be empty.");
        }
        if (!props.traceId || props.traceId.trim().length === 0) {
            throw new Error("TraceId cannot be empty.");
        }
        if (!props.spanId || props.spanId.trim().length === 0) {
            throw new Error("SpanId cannot be empty.");
        }
        if (!props.schemaVersion || props.schemaVersion.trim().length === 0) {
            throw new Error("SchemaVersion cannot be empty.");
        }
        return new CorrelationMetadata(props);
    }

    public static generate(): CorrelationMetadata {
        const now = Date.now();
        const rand = Math.random().toString(36).slice(2, 9);
        return new CorrelationMetadata({
            correlationId: `corr-${now}-${rand}`,
            requestId: `req-${now}-${rand}`,
            sessionId: `ses-${now}-${rand}`,
            traceId: `trace-${now}-${rand}`,
            spanId: `span-${now}-${rand}`,
            schemaVersion: "1.0.0"
        });
    }

    public getCorrelationId(): string {
        return this.correlationId;
    }

    public getRequestId(): string {
        return this.requestId;
    }

    public getSessionId(): string {
        return this.sessionId;
    }

    public getTraceId(): string {
        return this.traceId;
    }

    public getSpanId(): string {
        return this.spanId;
    }

    public getSchemaVersion(): string {
        return this.schemaVersion;
    }
}
