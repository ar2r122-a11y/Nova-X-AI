export class TransactionReceiptDto {
    constructor(
        public readonly transactionId: string,
        public readonly streamId: string,
        public readonly status: "committed" | "rolledback" | "pending",
        public readonly eventCount: number,
        public readonly committedAt?: number
    ) {}
}

export class StorageStatsDto {
    constructor(
        public readonly totalTransactions: number,
        public readonly totalEvents: number,
        public readonly totalSnapshots: number,
        public readonly totalBackups: number,
        public readonly activeStreams: number
    ) {}
}

export class SnapshotStatusDto {
    constructor(
        public readonly streamId: string,
        public readonly latestVersion: number,
        public readonly snapshotCount: number,
        public readonly oldestSnapshotAgeMs: number
    ) {}
}

export class MigrationStatusDto {
    constructor(
        public readonly currentVersion: string,
        public readonly pendingMigrations: string[],
        public readonly appliedMigrations: string[]
    ) {}
}

export class DeltaLogDto {
    constructor(
        public readonly streamId: string,
        public readonly deltaCount: number,
        public readonly latestDeltaTimestamp: number,
        public readonly hasConflicts: boolean
    ) {}
}

export class QuotaStatusDto {
    constructor(
        public readonly totalBytes: number,
        public readonly limitBytes: number,
        public readonly usagePercentage: number,
        public readonly isNearLimit: boolean,
        public readonly isExceeded: boolean
    ) {}
}

export class BackupStatusDto {
    constructor(
        public readonly backupId: string,
        public readonly createdAt: number,
        public readonly sizeBytes: number,
        public readonly compressed: boolean,
        public readonly checksum: string
    ) {}
}

export class StorageBudgetDto {
    constructor(
        public readonly transactionTimeoutMs: number,
        public readonly hardStorageLimitBytes: number,
        public readonly transactionMemoryLimitBytes: number,
        public readonly lruEvictionThreshold: number,
        public readonly batchWriteLimit: number
    ) {}
}
