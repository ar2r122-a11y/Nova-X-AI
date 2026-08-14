import { IQuery } from "@nova-x-ai/core";

export interface GetDiagnosticSnapshotQuery extends IQuery {
    readonly snapshotId?: string;
    readonly engine?: string;
}
