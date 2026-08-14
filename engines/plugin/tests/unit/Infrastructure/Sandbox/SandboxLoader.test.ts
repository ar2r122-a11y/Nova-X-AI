import { describe, test, expect, vi } from "vitest";

vi.stubGlobal("Worker", class {
    terminate: () => void = vi.fn();
    postMessage: () => void = vi.fn();
});

import { SandboxLoader } from "../../../../src/Infrastructure/Sandbox/SandboxLoader";

describe("SandboxLoader", () => {
    test("loads a plugin", async () => {
        const loader = new SandboxLoader({ publish: () => Promise.resolve() } as any);
        const manifest = { pluginId: "p1", name: "Test", version: "1.0.0" } as any;
        await loader.load(manifest);
        expect(loader.isLoaded("p1")).toBe(true);
    });

    test("unloads a plugin", async () => {
        const loader = new SandboxLoader({ publish: () => Promise.resolve() } as any);
        const manifest = { pluginId: "p1", name: "Test", version: "1.0.0" } as any;
        await loader.load(manifest);
        await loader.unload("p1");
        expect(loader.isLoaded("p1")).toBe(false);
    });
});
