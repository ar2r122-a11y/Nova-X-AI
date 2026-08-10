import type { ICommandHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { RunMigrationsCommand } from "../Commands";
import { SchemaVersion } from "../../Domain/ValueObjects";

export class RunMigrationsHandler implements ICommandHandler<RunMigrationsCommand> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(command: RunMigrationsCommand): Promise<void> {
        const runner = this.storage.getMigrationRunner();
        const pending = await runner.getPendingMigrations();

        for (const migration of pending) {
            if (command.targetVersion && SchemaVersion.parse(migration.version).isGreaterThan(SchemaVersion.parse(command.targetVersion))) {
                break;
            }
            await runner.applyMigration(migration);

            const { StorageMigrationAppliedEvent } = await import("../../Domain/Events");
            await this.storage.eventBus.publish(
                new StorageMigrationAppliedEvent(
                    migration.migrationId,
                    migration.version,
                    `storage-${Date.now()}`
                )
            );
        }
    }
}
