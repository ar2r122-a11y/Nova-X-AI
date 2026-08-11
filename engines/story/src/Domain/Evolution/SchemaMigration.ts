export interface MigrationRecord {
    readonly migrationId: string;
    readonly version: string;
    readonly description: string;
    appliedAt?: number;
}

export class SchemaMigration {
    private migrations: MigrationRecord[] = [];

    register(migration: MigrationRecord): void {
        this.migrations.push(migration);
        this.migrations.sort((a, b) => a.version.localeCompare(b.version));
    }

    getPendingMigrations(currentVersion: string): MigrationRecord[] {
        return this.migrations.filter((m) => m.version > currentVersion && !m.appliedAt);
    }

    getAppliedMigrations(): MigrationRecord[] {
        return this.migrations.filter((m) => !!m.appliedAt);
    }

    getCurrentSchemaVersion(): string {
        const applied = this.getAppliedMigrations();
        if (applied.length === 0) {
            return "0.0.0";
        }
        return applied[applied.length - 1].version;
    }

    async applyMigration(migration: MigrationRecord): Promise<void> {
        console.log(`Applying migration ${migration.migrationId} -> ${migration.version}`);
        migration.appliedAt = Date.now();
    }

    async migrate(currentVersion: string): Promise<string> {
        const pending = this.getPendingMigrations(currentVersion);
        for (const migration of pending) {
            await this.applyMigration(migration);
        }
        return this.getCurrentSchemaVersion();
    }
}
