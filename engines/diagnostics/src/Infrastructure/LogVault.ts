import type { ILogVault } from "../Domain/Services/ILogVault";
import { DiagnosticLogEntry } from "../Domain/Entities/DiagnosticLogEntry";

export class LogVault implements ILogVault {
    private readonly entries: DiagnosticLogEntry[] = [];
    private readonly quotaBytes: number = 50 * 1024 * 1024;
    private usedBytes = 0;

    public async append(entry: {
        level: "info" | "warn" | "error" | "debug";
        message: string;
        engine: string;
        correlationId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<void> {
        const logEntry = new DiagnosticLogEntry({
            id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            level: entry.level,
            message: this.maskSensitiveData(entry.message),
            engine: entry.engine,
            correlationId: entry.correlationId ?? null,
            metadata: entry.metadata ? { ...entry.metadata } : {},
            timestamp: Date.now()
        });

        const entrySize = this.estimateSize(logEntry);
        if (this.usedBytes + entrySize > this.quotaBytes) {
            const purged = this.purgeOldEntries(entrySize);
            if (purged === 0) {
                return;
            }
        }

        this.entries.push(logEntry);
        this.usedBytes += entrySize;
    }

    public async query(filters: {
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
    }>> {
        let results = this.entries;

        if (filters.engine) {
            results = results.filter(e => e.getEngine() === filters.engine);
        }
        if (filters.level) {
            results = results.filter(e => e.getLevel() === filters.level);
        }
        if (filters.fromTimestamp) {
            results = results.filter(e => e.getTimestamp() >= filters.fromTimestamp!);
        }
        if (filters.toTimestamp) {
            results = results.filter(e => e.getTimestamp() <= filters.toTimestamp!);
        }
        if (filters.limit) {
            results = results.slice(0, filters.limit);
        }

        return results.map(e => ({
            id: e.getId(),
            level: e.getLevel(),
            message: e.getMessage(),
            engine: e.getEngine(),
            correlationId: e.getCorrelationId(),
            metadata: e.getMetadata(),
            timestamp: e.getTimestamp()
        }));
    }

    public async purge(olderThanMs: number): Promise<number> {
        const cutoff = Date.now() - olderThanMs;
        let purged = 0;

        for (let i = this.entries.length - 1; i >= 0; i--) {
            if (this.entries[i].getTimestamp() < cutoff) {
                const size = this.estimateSize(this.entries[i]);
                this.usedBytes = Math.max(0, this.usedBytes - size);
                this.entries.splice(i, 1);
                purged++;
            }
        }

        return purged;
    }

    public async getQuotaUsage(): Promise<{
        usedBytes: number;
        quotaBytes: number;
        entryCount: number;
    }> {
        return {
            usedBytes: this.usedBytes,
            quotaBytes: this.quotaBytes,
            entryCount: this.entries.length
        };
    }

    private maskSensitiveData(message: string): string {
        return message
            .replace(/(password|secret|token|key)\s*[:=]\s*\S+/gi, "$1: ***")
            .replace(/\b\d{4,}\b/g, "***");
    }

    private estimateSize(entry: DiagnosticLogEntry): number {
        const json = JSON.stringify({
            id: entry.getId(),
            level: entry.getLevel(),
            message: entry.getMessage(),
            engine: entry.getEngine(),
            correlationId: entry.getCorrelationId(),
            metadata: entry.getMetadata(),
            timestamp: entry.getTimestamp()
        });
        return new Blob([json]).size;
    }

    private purgeOldEntries(requiredBytes: number): number {
        let freed = 0;
        const target = this.usedBytes + requiredBytes - this.quotaBytes;

        while (this.entries.length > 0 && freed < target) {
            const entry = this.entries.shift()!;
            const size = this.estimateSize(entry);
            this.usedBytes = Math.max(0, this.usedBytes - size);
            freed += size;
        }

        return freed;
    }
}
