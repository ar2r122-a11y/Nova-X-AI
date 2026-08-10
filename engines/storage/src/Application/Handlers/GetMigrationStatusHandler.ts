import type { IQueryHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { GetMigrationStatusQuery } from "../Queries";

export class GetMigrationStatusHandler implements IQueryHandler<GetMigrationStatusQuery, any> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(_query: GetMigrationStatusQuery): Promise<any> {
        const runner = this.storage.getMigrationRunner();
        const current = await runner.getCurrentSchemaVersion();
        const applied = await runner.getAppliedMigrations();
        const pending = await runner.getPendingMigrations();

        return {
            currentVersion: current,
            pendingMigrations: pending.map(m => m.version),
            appliedMigrations: applied.map(m => m.version)
        };
    }
}
