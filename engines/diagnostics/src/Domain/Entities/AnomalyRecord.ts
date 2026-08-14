export class AnomalyRecord {
    private readonly id: string;
    private readonly engineName: string;
    private readonly anomalyType: string;
    private readonly severity: "low" | "medium" | "high" | "critical";
    private readonly message: string;
    private readonly detectedAt: number;
    private readonly context: Record<string, unknown>;
    private readonly resolved: boolean;
    private readonly resolvedAt: number | null;

    constructor(opts: {
        id: string;
        engineName: string;
        anomalyType: string;
        severity: "low" | "medium" | "high" | "critical";
        message: string;
        detectedAt: number;
        context: Record<string, unknown>;
        resolved: boolean;
        resolvedAt: number | null;
    }) {
        this.id = opts.id;
        this.engineName = opts.engineName;
        this.anomalyType = opts.anomalyType;
        this.severity = opts.severity;
        this.message = opts.message;
        this.detectedAt = opts.detectedAt;
        this.context = opts.context;
        this.resolved = opts.resolved;
        this.resolvedAt = opts.resolvedAt;
    }

    public getId(): string {
        return this.id;
    }

    public getEngineName(): string {
        return this.engineName;
    }

    public getAnomalyType(): string {
        return this.anomalyType;
    }

    public getSeverity(): "low" | "medium" | "high" | "critical" {
        return this.severity;
    }

    public getMessage(): string {
        return this.message;
    }

    public getDetectedAt(): number {
        return this.detectedAt;
    }

    public getContext(): Record<string, unknown> {
        return this.context;
    }

    public isResolved(): boolean {
        return this.resolved;
    }

    public getResolvedAt(): number | null {
        return this.resolvedAt;
    }

    public resolve(timestamp: number): AnomalyRecord {
        return new AnomalyRecord({
            ...this,
            resolved: true,
            resolvedAt: timestamp
        });
    }
}
