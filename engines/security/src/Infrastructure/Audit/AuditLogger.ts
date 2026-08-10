import type { IAuditLogger } from "../../Contracts";
import { AuditLogEntry } from "../../Domain/Entities";
import { SecurityEngineAggregate } from "../../Domain/Aggregates";

export class AuditLogger implements IAuditLogger {
    constructor(private readonly aggregate: SecurityEngineAggregate) {}

    async log(entry: Omit<AuditLogEntry, "logId" | "timestamp" | "signature">): Promise<AuditLogEntry> {
        const logEntry: AuditLogEntry = {
            ...entry,
            logId: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            timestamp: Date.now(),
            signature: this.computeSignature(entry)
        };

        this.aggregate.appendAuditLog(logEntry);
        return logEntry;
    }

    async getLog(identityId?: string, limit: number = 100): Promise<AuditLogEntry[]> {
        const log = this.aggregate.getAuditLog();
        if (!identityId) return log.slice(-limit);
        return log.filter(entry => entry.identityId === identityId).slice(-limit);
    }

    private computeSignature(entry: Omit<AuditLogEntry, "logId" | "timestamp" | "signature">): string {
        const data = `${entry.identityId}:${entry.action}:${entry.resource}:${entry.result}:${entry.correlationId}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `sha256-${Math.abs(hash).toString(16).padStart(8, "0")}`;
    }
}
