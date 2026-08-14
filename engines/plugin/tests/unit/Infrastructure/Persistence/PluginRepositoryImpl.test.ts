import { describe, test, expect } from "vitest";
import { PluginRepositoryImpl } from "../../../../src/Infrastructure/Persistence/PluginRepositoryImpl";

describe("PluginRepositoryImpl", () => {
    const repo = new PluginRepositoryImpl();

    test("registers and retrieves plugin", () => {
        const manifest = { pluginId: "p1", name: "Test", version: "1.0.0" } as any;
        repo.registerPlugin(manifest);
        expect(repo.getPlugin("p1")).toBe(manifest);
    });

    test("unregisters plugin", () => {
        repo.unregisterPlugin("p1");
        expect(repo.getPlugin("p1")).toBeUndefined();
    });

    test("lists all plugins", () => {
        const manifest = { pluginId: "p2", name: "Test2", version: "1.0.0" } as any;
        repo.registerPlugin(manifest);
        expect(repo.getAllPlugins()).toHaveLength(1);
    });

    test("checks if installed", () => {
        expect(repo.isInstalled("p2")).toBe(true);
        expect(repo.isInstalled("unknown")).toBe(false);
    });
});
