import type { HeapSnapshotMetadata } from "../Entities/HeapSnapshotMetadata";
import type { CrashDumpRecord } from "../Entities/CrashDumpRecord";
import type { DiagnosticLogEntry } from "../Entities/DiagnosticLogEntry";

export interface IHeapSnapshotRepository {
    save(snapshot: HeapSnapshotMetadata): Promise<void>;
    getById(snapshotId: string): Promise<HeapSnapshotMetadata | null>;
    listByEngine(engine: string): Promise<HeapSnapshotMetadata[]>;
    delete(snapshotId: string): Promise<void>;
    getAll(): Promise<HeapSnapshotMetadata[]>;
}

export interface ICrashDumpRepository {
    save(dump: CrashDumpRecord): Promise<void>;
    getById(dumpId: string): Promise<CrashDumpRecord | null>;
    listByEngine(engine: string): Promise<CrashDumpRecord[]>;
    getAll(): Promise<CrashDumpRecord[]>;
}

export interface IDiagnosticLogRepository {
    append(entry: DiagnosticLogEntry): Promise<void>;
    query(filters: {
        engine?: string;
        level?: string;
        fromTimestamp?: number;
        toTimestamp?: number;
        limit?: number;
    }): Promise<DiagnosticLogEntry[]>;
    purge(olderThanMs: number): Promise<number>;
    count(): Promise<number>;
}
