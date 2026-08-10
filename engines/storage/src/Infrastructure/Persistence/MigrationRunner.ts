import { IMigrationRunner, MigrationRecord } from "../../Contracts";
import { IndexedDBAdapter } from "./IndexedDBAdapter";
import { SchemaVersion } from "../../Domain/ValueObjects";

export class MigrationRunner implements IMigrationRunner {
    private readonly adapter: IndexedDBAdapter;

    constructor(adapter: IndexedDBAdapter) {
        this.adapter = adapter;
    }

    async getPendingMigrations(): Promise<MigrationRecord[]> {
        const applied = await this.getAppliedMigrations();
        const appliedVersions = new Set(applied.map(m => m.version));
        const allMigrations = await this.getAllMigrations();

        return allMigrations.filter(m => !appliedVersions.has(m.version));
    }

    async getAppliedMigrations(): Promise<MigrationRecord[]> {
        const tx = this.adapter.transaction(["migrations"], "readonly");
        const store = tx.objectStore("migrations");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result.filter((m: MigrationRecord) => m.status === "applied"));
            request.onerror = () => reject(request.error);
        });
    }

    async applyMigration(migration: MigrationRecord): Promise<void> {
        const tx = this.adapter.transaction(["migrations"], "readwrite");
        const store = tx.objectStore("migrations");

        await new Promise<void>((resolve, reject) => {
            const request = store.put({ ...migration, status: "applied", appliedAt: Date.now() });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async rollbackMigration(migrationId: string): Promise<void> {
        const tx = this.adapter.transaction(["migrations"], "readwrite");
        const store = tx.objectStore("migrations");

        await new Promise<void>((resolve, reject) => {
            const request = store.put({ migrationId, status: "rolledback" });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getCurrentSchemaVersion(): Promise<string> {
        const applied = await this.getAppliedMigrations();
        if (applied.length === 0) return "0.0.0";

        const sorted = applied.sort((a, b) => SchemaVersion.parse(a.version).toString().localeCompare(SchemaVersion.parse(b.version).toString()));
        return sorted[sorted.length - 1].version;
    }

    private async getAllMigrations(): Promise<MigrationRecord[]> {
        const tx = this.adapter.transaction(["migrations"], "readonly");
        const store = tx.objectStore("migrations");

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as MigrationRecord[]);
            request.onerror = () => reject(request.error);
        });
    }
}
