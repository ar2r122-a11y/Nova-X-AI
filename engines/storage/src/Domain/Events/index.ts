import { IDomainEvent } from "@nova-x-ai/core";

export class StorageTransactionCommittedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORE_TransactionCommitted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly transactionId: string,
        public readonly streamId: string,
        public readonly eventCount: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class StorageRecoveryEvent implements IDomainEvent {
    readonly eventType = "EVT_STORE_RecoveryCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly recoveredTransactions: number,
        public readonly recoveredEvents: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class StorageExecutionFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORE_ExecutionFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly operation: string,
        public readonly error: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class StorageSnapshotTakenEvent implements IDomainEvent {
    readonly eventType = "EVT_STORE_SnapshotTaken";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly snapshotId: string,
        public readonly streamId: string,
        public readonly version: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class StorageMigrationAppliedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORE_MigrationApplied";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly migrationId: string,
        public readonly version: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class StorageQuotaExceededEvent implements IDomainEvent {
    readonly eventType = "EVT_STORE_QuotaExceeded";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly limitBytes: number,
        public readonly usedBytes: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class StorageDeltaSyncedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORE_DeltaSynced";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly streamId: string,
        public readonly deltaCount: number,
        public readonly vectorClock: Record<string, number>,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class StorageBackupCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORE_BackupCompleted";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly backupId: string,
        public readonly sizeBytes: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}
