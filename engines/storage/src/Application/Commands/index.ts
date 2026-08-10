import type { ICommand } from "@nova-x-ai/core";

export class CommitTransactionCommand implements ICommand {
    constructor(
        public readonly streamId: string,
        public readonly events: unknown[],
        public readonly expectedVersion: number
    ) {}
}

export class InterruptStorageCommand implements ICommand {
    constructor(
        public readonly reason: string
    ) {}
}

export class CompactSnapshotsCommand implements ICommand {
    constructor(
        public readonly streamId?: string,
        public readonly maxAgeMs: number = 86400000
    ) {}
}

export class RunMigrationsCommand implements ICommand {
    constructor(
        public readonly targetVersion?: string
    ) {}
}

export class BackupStorageCommand implements ICommand {
    constructor(
        public readonly compressionEnabled: boolean = true
    ) {}
}

export class RestoreStorageCommand implements ICommand {
    constructor(
        public readonly backupId: string
    ) {}
}

export class ResetDeltaLogCommand implements ICommand {
    constructor(
        public readonly streamId: string
    ) {}
}
