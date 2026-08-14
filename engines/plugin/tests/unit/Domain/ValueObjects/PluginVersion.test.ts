import { describe, test, expect } from "vitest";
import { PluginVersion } from "../../../../src/Domain/ValueObjects/PluginVersion";

describe("PluginVersion", () => {
    test("parses a valid semantic version", () => {
        const version = PluginVersion.parse("1.2.3");
        expect(version.major).toBe(1);
        expect(version.minor).toBe(2);
        expect(version.patch).toBe(3);
    });

    test("satisfies minimum version", () => {
        const version = PluginVersion.parse("2.0.0");
        const required = PluginVersion.parse("1.5.0");
        expect(version.satisfiesSemantic(required)).toBe(true);
    });

    test("does not satisfy higher minimum version", () => {
        const version = PluginVersion.parse("1.0.0");
        const required = PluginVersion.parse("1.5.0");
        expect(version.satisfiesSemantic(required)).toBe(false);
    });
});
