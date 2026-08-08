import { describe, it, expect, beforeEach } from "vitest";
import { ModuleRegistry } from "../../src/modules/ModuleRegistry";
import type { ICoreModule } from "../../src/modules/ICoreModule";
import type { IContainer } from "../../src/container/IContainer";

function makeModule(name: string): ICoreModule {
    return {
        moduleName: name,
        configureServices: (_container: IContainer) => {},
        onInit: async () => {},
        onDestroy: async () => {}
    };
}

describe("ModuleRegistry", () => {

    let registry: ModuleRegistry;

    beforeEach(() => {
        registry = new ModuleRegistry();
    });

    it("registers a module and reports it as present", () => {
        const mod = makeModule("alpha");
        registry.register(mod);
        expect(registry.has("alpha")).toBe(true);
    });

    it("throws when registering a duplicate module name", () => {
        const mod = makeModule("alpha");
        registry.register(mod);
        expect(() => registry.register(mod)).toThrow();
    });

    it("get returns the registered module", () => {
        const mod = makeModule("alpha");
        registry.register(mod);
        expect(registry.get("alpha")).toBe(mod);
    });

    it("get returns undefined for an unknown module", () => {
        expect(registry.get("unknown")).toBeUndefined();
    });

    it("getAll returns all registered modules", () => {
        const a = makeModule("alpha");
        const b = makeModule("beta");
        registry.register(a);
        registry.register(b);
        const all = registry.getAll();
        expect(all).toHaveLength(2);
        expect(all).toContain(a);
        expect(all).toContain(b);
    });

    it("remove deletes a registered module", () => {
        const mod = makeModule("alpha");
        registry.register(mod);
        registry.remove("alpha");
        expect(registry.has("alpha")).toBe(false);
    });

    it("clear removes all modules", () => {
        registry.register(makeModule("alpha"));
        registry.register(makeModule("beta"));
        registry.clear();
        expect(registry.count).toBe(0);
    });

    it("count reflects the number of registered modules", () => {
        expect(registry.count).toBe(0);
        registry.register(makeModule("alpha"));
        expect(registry.count).toBe(1);
        registry.register(makeModule("beta"));
        expect(registry.count).toBe(2);
    });

});
