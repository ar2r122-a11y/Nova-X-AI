import { describe, it, expect, vi, beforeEach } from "vitest";
import { NovaCoreRuntime } from "../../src/runtime/NovaCoreRuntime";
import { RuntimeState } from "../../src/runtime/RuntimeState";
import { RuntimeConfigurationBuilder } from "../../src/Builders/RuntimeConfigurationBuilder";
import type { ICoreModule } from "../../src/modules/ICoreModule";
import type { IContainer } from "../../src/container/IContainer";

function makeConfig() {
    return new RuntimeConfigurationBuilder()
        .withApplicationName("test-app")
        .withEnvironment("test")
        .withDebug(true)
        .build();
}

function makeModule(
    name: string,
    overrides: Partial<ICoreModule> = {}
): ICoreModule {
    return {
        moduleName: name,
        configureServices: vi.fn((_c: IContainer) => {}),
        onInit: vi.fn(async () => {}),
        onDestroy: vi.fn(async () => {}),
        ...overrides
    };
}

describe("NovaCoreRuntime", () => {

    let runtime: NovaCoreRuntime;

    beforeEach(() => {
        runtime = new NovaCoreRuntime(makeConfig());
    });

    // -- Initial state --

    it("starts in Created state", () => {
        expect(runtime.getState()).toBe(RuntimeState.Created);
    });

    it("has no registered modules initially", () => {
        expect(runtime.getRegisteredModules()).toHaveLength(0);
    });

    // -- Module registration --

    it("registers a module and exposes it via getRegisteredModules", () => {
        const mod = makeModule("alpha");
        runtime.registerModule(mod);
        expect(runtime.getRegisteredModules()).toContain(mod);
    });

    it("throws when registering a duplicate module", () => {
        const mod = makeModule("alpha");
        runtime.registerModule(mod);
        expect(() => runtime.registerModule(mod)).toThrow();
    });

    // -- Initialization --

    it("transitions to Running after initialize()", async () => {
        await runtime.initialize();
        expect(runtime.getState()).toBe(RuntimeState.Running);
    });

    it("calls configureServices and onInit on each registered module", async () => {
        const mod = makeModule("alpha");
        runtime.registerModule(mod);
        await runtime.initialize();
        expect(mod.configureServices).toHaveBeenCalledOnce();
        expect(mod.onInit).toHaveBeenCalledOnce();
    });

    it("is idempotent - second initialize() call is a no-op", async () => {
        const mod = makeModule("alpha");
        runtime.registerModule(mod);
        await runtime.initialize();
        await runtime.initialize();
        expect(mod.onInit).toHaveBeenCalledOnce();
        expect(runtime.getState()).toBe(RuntimeState.Running);
    });

    // -- Shutdown --

    it("transitions to Stopped after shutdown()", async () => {
        await runtime.initialize();
        await runtime.shutdown();
        expect(runtime.getState()).toBe(RuntimeState.Stopped);
    });

    it("calls onDestroy on each module during shutdown", async () => {
        const mod = makeModule("alpha");
        runtime.registerModule(mod);
        await runtime.initialize();
        await runtime.shutdown();
        expect(mod.onDestroy).toHaveBeenCalledOnce();
    });

    it("calls onDestroy in reverse registration order", async () => {
        const order: string[] = [];
        const a = makeModule("alpha", {
            onDestroy: async () => { order.push("alpha"); }
        });
        const b = makeModule("beta", {
            onDestroy: async () => { order.push("beta"); }
        });
        runtime.registerModule(a);
        runtime.registerModule(b);
        await runtime.initialize();
        await runtime.shutdown();
        expect(order).toEqual(["beta", "alpha"]);
    });

    it("is idempotent - second shutdown() call is a no-op", async () => {
        const mod = makeModule("alpha");
        runtime.registerModule(mod);
        await runtime.initialize();
        await runtime.shutdown();
        await runtime.shutdown();
        expect(mod.onDestroy).toHaveBeenCalledOnce();
        expect(runtime.getState()).toBe(RuntimeState.Stopped);
    });

    it("shutdown() is a no-op when not Running", async () => {
        await runtime.shutdown();
        expect(runtime.getState()).toBe(RuntimeState.Created);
    });

    // -- Container / EventBus access --

    it("exposes a non-null container", () => {
        expect(runtime.getContainer()).toBeDefined();
    });

    it("exposes a non-null event bus", () => {
        expect(runtime.getEventBus()).toBeDefined();
    });

    it("resolve() delegates to the internal container", async () => {
        const token = Symbol("MyService");
        class MyService {}
        runtime.getContainer().registerSingleton(token, MyService);
        const instance = runtime.resolve<MyService>(token);
        expect(instance).toBeInstanceOf(MyService);
    });

    // -- SDS section 1: 500ms initialization budget --

    it("initializes within 500ms (SDS section 1 performance constraint)", async () => {
        for (let i = 0; i < 5; i++) {
            runtime.registerModule(makeModule(`module-${i}`));
        }
        const start = Date.now();
        await runtime.initialize();
        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(500);
    });

});
