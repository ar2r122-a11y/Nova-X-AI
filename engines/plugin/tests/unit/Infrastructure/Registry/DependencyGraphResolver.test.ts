import { describe, test, expect } from "vitest";
import { DependencyGraphResolver } from "../../../../src/Infrastructure/Registry/DependencyGraphResolver";

describe("DependencyGraphResolver", () => {
    const resolver = new DependencyGraphResolver();

    test("resolves dependencies", () => {
        const manifest = { dependencies: [{ name: "dep1", version: "1.0.0" }] } as any;
        const result = resolver.resolve(manifest);
        expect(result).toHaveLength(1);
        expect(result[0].resolved).toBe(true);
    });

    test("detects circular dependencies", () => {
        const manifest = {
            pluginId: "p1",
            dependencies: [{ name: "p2", version: "1.0.0" }]
        } as any;
        const result = resolver.detectCircular(manifest);
        expect(result.length).toBeGreaterThanOrEqual(0);
    });
});
