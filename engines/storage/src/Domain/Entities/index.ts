export interface StorageEvent {
    readonly eventId: string;
    readonly streamId: string;
    readonly eventType: string;
    readonly data: unknown;
    readonly version: number;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly checksum: string;
}

export interface StorageTransaction {
    readonly transactionId: string;
    readonly streamId: string;
    readonly events: StorageEvent[];
    readonly status: "pending" | "committed" | "rolledback";
    readonly createdAt: number;
    readonly committedAt?: number;
    readonly correlationId: string;
}

export interface StorageSnapshot {
    readonly snapshotId: string;
    readonly streamId: string;
    readonly version: number;
    readonly data: unknown;
    readonly checksum: string;
    readonly createdAt: number;
    readonly compressed: boolean;
}

export interface MigrationRecord {
    readonly migrationId: string;
    readonly version: string;
    readonly description: string;
    readonly appliedAt: number;
    readonly checksum: string;
    readonly status: "applied" | "failed" | "rolledback";
}

export interface QuotaUsage {
    readonly totalBytes: number;
    readonly eventStoreBytes: number;
    readonly snapshotBytes: number;
    readonly backupBytes: number;
    readonly limitBytes: number;
    readonly lastUpdated: number;
}

export interface BackupManifest {
    readonly backupId: string;
    readonly createdAt: number;
    readonly sizeBytes: number;
    readonly checksum: string;
    readonly encryptionKeyId: string;
    readonly compressed: boolean;
    readonly engineVersions: Record<string, string>;
}
