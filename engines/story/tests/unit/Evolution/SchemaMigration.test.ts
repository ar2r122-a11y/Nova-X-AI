import { describe, test, expect } from "vitest";
import { SchemaMigration } from "../../../src/Domain/Evolution/SchemaMigration";

describe("SchemaMigration", () => {
    test("registers and sorts migrations", () => {
        const migration = new SchemaMigration();
        migration.register({ migrationId: "m1", version: "1.0.0", description: "Initial" });
        migration.register({ migrationId: "m2", version: "1.1.0", description: "Update" });

        const pending = migration.getPendingMigrations("0.0.0");
        expect(pending.length).toBe(2);
        expect(pending[0].version).toBe("1.0.0");
    });

    test("returns current schema version", () => {
        const migration = new SchemaMigration();
        expect(migration.getCurrentSchemaVersion()).toBe("0.0.0");

        const m1 = { migrationId: "m1", version: "1.0.0", description: "Initial" };
        migration.register(m1);
        migration.applyMigration(m1);
        expect(migration.getCurrentSchemaVersion()).toBe("1.0.0");
    });

    test("returns empty pending when up to date", () => {
        const migration = new SchemaMigration();
        const m1 = { migrationId: "m1", version: "1.0.0", description: "Initial" };
        migration.register(m1);
        migration.applyMigration(m1);

        const pending = migration.getPendingMigrations("1.0.0");
        expect(pending.length).toBe(0);
    });
});
