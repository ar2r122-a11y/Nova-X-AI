import type { IQuery } from "@nova-x-ai/core";

export class GetStorageStatsQuery implements IQuery {
    constructor(public readonly includeBreakdown: boolean = false) {}
}

export class GetTransactionHistoryQuery implements IQuery {
    constructor(
        public readonly streamId?: string,
        public readonly limit: number = 50
    ) {}
}

export class GetSnapshotStatusQuery implements IQuery {
    constructor(
        public readonly streamId?: string
    ) {}
}

export class GetMigrationStatusQuery implements IQuery {
    constructor() {}
}

export class GetDeltaLogQuery implements IQuery {
    constructor(
        public readonly streamId: string,
        public readonly limit: number = 100
    ) {}
}

export class GetQuotaStatusQuery implements IQuery {
    constructor() {}
}

export class GetBackupStatusQuery implements IQuery {
    constructor() {}
}
