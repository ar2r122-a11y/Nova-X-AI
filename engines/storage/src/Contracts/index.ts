import type { IEventBus } from "@nova-x-ai/core";
import type { StorageEvent, StorageSnapshot, MigrationRecord, QuotaUsage, BackupManifest, VectorClock } from "../Domain";

export type { StorageEvent, StorageSnapshot, MigrationRecord, QuotaUsage, BackupManifest, VectorClock } from "../Domain";

export interface IRepository<T> {
    getById(key: string): Promise<T | null>;
    getAll(): Promise<T[]>;
    save(entity: T): Promise<void>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
}

export interface IRepositoryFactory {
    createRepository<T>(collection: string): IRepository<T>;
    registerRepository<T>(collection: string, repository: IRepository<T>): void;
    getRepository<T>(collection: string): IRepository<T> | undefined;
}

export interface IUnitOfWork {
    readonly transactionId: string;
    getRepository<T>(collection: string): IRepository<T>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    isActive(): boolean;
}

export interface IEventStore {
    appendToStream(streamId: string, events: StorageEvent[], expectedVersion: number): Promise<void>;
    readStream(streamId: string, fromVersion: number): Promise<StorageEvent[]>;
    readAllStreams(fromPosition: number, limit: number): Promise<StorageEvent[]>;
    getStreamVersion(streamId: string): Promise<number>;
    subscribeToStream(streamId: string, handler: (event: StorageEvent) => Promise<void>): () => void;
}

export interface ISnapshotStore {
    saveSnapshot(snapshot: StorageSnapshot): Promise<void>;
    getSnapshot(streamId: string): Promise<StorageSnapshot | null>;
    deleteSnapshot(streamId: string): Promise<void>;
    getAllSnapshots(): Promise<StorageSnapshot[]>;
    compact(streamId: string, maxAgeMs: number): Promise<number>;
}

export interface IProjectionStore {
    saveProjection(name: string, data: unknown): Promise<void>;
    getProjection(name: string): Promise<unknown>;
    deleteProjection(name: string): Promise<void>;
    listProjections(): Promise<string[]>;
    resetProjection(name: string): Promise<void>;
}

export interface IStorageWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}

export interface IMigrationRunner {
    getPendingMigrations(): Promise<MigrationRecord[]>;
    getAppliedMigrations(): Promise<MigrationRecord[]>;
    applyMigration(migration: MigrationRecord): Promise<void>;
    rollbackMigration(migrationId: string): Promise<void>;
    getCurrentSchemaVersion(): Promise<string>;
}

export interface IWAL {
    append(entry: { operation: string; data: unknown; timestamp: number }): Promise<void>;
    readEntries(fromIndex: number): Promise<{ operation: string; data: unknown; timestamp: number }[]>;
    truncate(upToIndex: number): Promise<void>;
    clear(): Promise<void>;
    getCount(): Promise<number>;
}

export interface IDeltaLog {
    recordDelta(streamId: string, delta: unknown, clock: VectorClock): Promise<void>;
    getDeltas(streamId: string): Promise<{ delta: unknown; clock: VectorClock; timestamp: number }[]>;
    resolveConflicts(streamId: string, localClock: VectorClock, remoteClock: VectorClock): Promise<unknown>;
    clear(streamId: string): Promise<void>;
}

export interface IVectorClockStore {
    save(streamId: string, clock: VectorClock): Promise<void>;
    load(streamId: string): Promise<VectorClock | null>;
    delete(streamId: string): Promise<void>;
}

export interface IBackupStore {
    createBackup(manifest: BackupManifest): Promise<void>;
    getBackup(backupId: string): Promise<BackupManifest | null>;
    listBackups(): Promise<BackupManifest[]>;
    deleteBackup(backupId: string): Promise<void>;
    restoreBackup(backupId: string): Promise<void>;
}

export interface IQuotaPolicy {
    checkQuota(usage: QuotaUsage): { allowed: boolean; reason?: string };
    calculateUsage(current: QuotaUsage, addition: { bytes: number }): QuotaUsage;
    getEvictionCandidates(usage: QuotaUsage): Promise<string[]>;
}

export interface ICompressionEngine {
    compress(data: ArrayBuffer): Promise<{ data: ArrayBuffer; algorithm: string }>;
    decompress(data: ArrayBuffer, algorithm: string): Promise<ArrayBuffer>;
    estimateCompressionRatio(data: ArrayBuffer): Promise<number>;
}

export interface IDeduplicationEngine {
    computeFingerprint(data: ArrayBuffer): Promise<string>;
    isDuplicate(fingerprint: string): Promise<boolean>;
    recordFingerprint(fingerprint: string): Promise<void>;
    prune(olderThanMs: number): Promise<number>;
}

export interface IEncryptionBoundary {
    encrypt(data: ArrayBuffer, keyId: string): Promise<{ data: ArrayBuffer; keyId: string }>;
    decrypt(data: ArrayBuffer, keyId: string): Promise<ArrayBuffer>;
    rotateKey(oldKeyId: string, newKeyId: string): Promise<void>;
}

export interface ICacheProvider {
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlMs?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    getKeys(pattern?: string): Promise<string[]>;
}

export interface IStorageEngine {
    readonly eventBus: IEventBus;
    getRepository<T>(collection: string): IRepository<T>;
    getUnitOfWork(): IUnitOfWork;
    getEventStore(): IEventStore;
    getSnapshotStore(): ISnapshotStore;
    getProjectionStore(): IProjectionStore;
    getWAL(): IWAL;
    getDeltaLog(): IDeltaLog;
    getBackupStore(): IBackupStore;
    getQuotaPolicy(): IQuotaPolicy;
    getCompressionEngine(): ICompressionEngine;
    getDeduplicationEngine(): IDeduplicationEngine;
    getEncryptionBoundary(): IEncryptionBoundary;
    getCacheProvider(): ICacheProvider;
    getMigrationRunner(): IMigrationRunner;
    getQuotaUsage(): Promise<QuotaUsage>;
    interrupt(): Promise<void>;
    recover(): Promise<void>;
}
