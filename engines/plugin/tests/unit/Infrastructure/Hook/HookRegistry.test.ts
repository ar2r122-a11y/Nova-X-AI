import { describe, test, expect, vi } from "vitest";
import { HookRegistry } from "../../../../src/Infrastructure/Hook/HookRegistry";

describe("HookRegistry", () => {
    const registry = new HookRegistry();

    test("registers and triggers hook", async () => {
        const handler = vi.fn();
        registry.registerHook("p1", "hook1", handler);
        await registry.triggerHook("hook1", {});
        expect(handler).toHaveBeenCalled();
    });

    test("unregisters hook", async () => {
        registry.unregisterHook("p1", "hook1");
        await registry.triggerHook("hook1", {});
        expect(registry.getHooks("p1")).toHaveLength(0);
    });
});
