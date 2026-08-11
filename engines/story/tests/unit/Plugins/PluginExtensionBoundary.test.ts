import { describe, test, expect, vi } from "vitest";
import { PluginExtensionBoundary } from "../../../src/Infrastructure/Plugins/PluginExtensionBoundary";
import { StoryEngineAclTranslator } from "../../../src/Infrastructure/ACL/StoryEngineAclTranslator";

describe("PluginExtensionBoundary", () => {
    const acl = new StoryEngineAclTranslator();
    const boundary = new PluginExtensionBoundary(acl);

    test("registers and triggers extension point", async () => {
        const handler = vi.fn();
        boundary.registerExtensionPoint("test-point", handler);
        await boundary.triggerExtensionPoint("test-point", { data: "value" });
        expect(handler).toHaveBeenCalledWith({ data: "value" });
    });

    test("throws for unknown extension point", async () => {
        await expect(boundary.triggerExtensionPoint("unknown", {})).rejects.toThrow("Extension point not found");
    });

    test("registers mini-game", () => {
        const acl2 = new StoryEngineAclTranslator();
        const boundary2 = new PluginExtensionBoundary(acl2);
        boundary2.registerMiniGame({ name: "game-1" });
        const extensions = boundary2.getRegisteredExtensions();
        expect(extensions).toEqual([]);
    });
});
