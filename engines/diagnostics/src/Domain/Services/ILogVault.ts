export interface ILogVault {
    append(entry: {
        level: "info" | "warn" | "error" | "debug";
        message: string;
        engine: string;
        correlationId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<void>;

    query(filters: {
        engine?: string;
        level?: string;
        fromTimestamp?: number;
        toTimestamp?: number;
        limit?: number;
    }): Promise<Array<{
        id: string;
        level: string;
        message: string;
        engine: string;
        correlationId: string | null;
        metadata: Record<string, unknown>;
        timestamp: number;
    }>>;

    purge(olderThanMs: number): Promise<number>;

    getQuotaUsage(): Promise<{
        usedBytes: number;
        quotaBytes: number;
        entryCount: number;
    }>;
}
