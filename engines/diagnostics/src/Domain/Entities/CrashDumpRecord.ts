export class CrashDumpRecord {
    private readonly dumpId: string;
    private readonly capturedAt: number;
    private readonly engine: string;
    private readonly errorMessage: string;
    private readonly errorStack: string | null;
    private readonly context: Record<string, unknown>;
    private readonly encrypted: boolean;
    private readonly correlationId: string;

    constructor(opts: {
        dumpId: string;
        capturedAt: number;
        engine: string;
        errorMessage: string;
        errorStack: string | null;
        context: Record<string, unknown>;
        encrypted: boolean;
        correlationId: string;
    }) {
        this.dumpId = opts.dumpId;
        this.capturedAt = opts.capturedAt;
        this.engine = opts.engine;
        this.errorMessage = opts.errorMessage;
        this.errorStack = opts.errorStack;
        this.context = opts.context;
        this.encrypted = opts.encrypted;
        this.correlationId = opts.correlationId;
    }

    public getDumpId(): string {
        return this.dumpId;
    }

    public getCapturedAt(): number {
        return this.capturedAt;
    }

    public getEngine(): string {
        return this.engine;
    }

    public getErrorMessage(): string {
        return this.errorMessage;
    }

    public getErrorStack(): string | null {
        return this.errorStack;
    }

    public getContext(): Record<string, unknown> {
        return this.context;
    }

    public isEncrypted(): boolean {
        return this.encrypted;
    }

    public getCorrelationId(): string {
        return this.correlationId;
    }
}
