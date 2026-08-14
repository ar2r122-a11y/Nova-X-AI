import { describe, test, expect } from "vitest";
import { PluginId } from "../../../../src/Domain/ValueObjects/PluginId";

describe("PluginId", () => {
    test("creates a valid plugin id", () => {
        const id = PluginId.create("test-plugin");
        expect(id.id).toBe("test-plugin");
    });

    test("generates unique ids", () => {
        const id1 = PluginId.create("p1");
        const id2 = PluginId.create("p2");
        expect(id1.id).not.toBe(id2.id);
    });
});
