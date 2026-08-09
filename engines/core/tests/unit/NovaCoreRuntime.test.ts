import { describe, it, expect, vi, beforeEach } from "vitest";
import { NovaCoreRuntime } from "../../src/runtime/NovaCoreRuntime";
import { RuntimeState } from "../../src/runtime/RuntimeState";
import { RuntimeConfigurationBuilder } from "../../src/Builders/RuntimeConfigurationBuilder";
import type { ICoreModule } from "../../src/modules/ICoreModule";
import type { IContainer } from "../../src/container/IContainer";

type TestModule = ICoreModule & {
    readonly dependencies?: readonly string[];
};

function makeConfig() {
    return new RuntimeConfigurationBuilder()
        .withApplicationName("test-app")
        .withEnvironment("test")
        .withDebug(true)
        .build();
}

function makeModule(
    name: string,
    overrides: Partial<TestModule> = {}
): TestModule {
    return {
        moduleName: name,

        configureServices: vi.fn(
            (_c: IContainer) => {}
        ),

        onInit: vi.fn(
            async () => {}
        ),

        onDestroy: vi.fn(
            async () => {}
        ),

        ...overrides
    };
}

describe("NovaCoreRuntime", () => {

    let runtime: NovaCoreRuntime;

    beforeEach(() => {
        runtime = new NovaCoreRuntime(
            makeConfig()
        );
    });

    // -- Initial state --

    it("starts in Created state", () => {
        expect(runtime.getState()).toBe(
            RuntimeState.Created
        );
    });

    it("has no registered modules initially", () => {
        expect(
            runtime.getRegisteredModules()
        ).toHaveLength(0);
    });

    // -- Module registration --

    it("registers a module and exposes it via getRegisteredModules", () => {
        const mod = makeModule("alpha");

        runtime.registerModule(mod);

        expect(
            runtime.getRegisteredModules()
        ).toContain(mod);
    });

    it("throws when registering a duplicate module", () => {
        const mod = makeModule("alpha");

        runtime.registerModule(mod);

        expect(() =>
            runtime.registerModule(mod)
        ).toThrow();
    });

    // -- Initialization --

    it("transitions to Running after initialize()", async () => {
        await runtime.initialize();

        expect(runtime.getState()).toBe(
            RuntimeState.Running
        );
    });

    it("calls configureServices and onInit on each registered module", async () => {
        const mod = makeModule("alpha");

        runtime.registerModule(mod);

        await runtime.initialize();

        expect(
            mod.configureServices
        ).toHaveBeenCalledOnce();

        expect(
            mod.onInit
        ).toHaveBeenCalledOnce();
    });

    it("is idempotent - second initialize() call is a no-op", async () => {
        const mod = makeModule("alpha");

        runtime.registerModule(mod);

        await runtime.initialize();
        await runtime.initialize();

        expect(
            mod.onInit
        ).toHaveBeenCalledOnce();

        expect(runtime.getState()).toBe(
            RuntimeState.Running
        );
    });

    // -- Dependency Graph --

    it("initializes modules in dependency order", async () => {
        const order: string[] = [];

        const core = makeModule("core", {
            onInit: async () => {
                order.push("core");
            }
        });

        const database = makeModule("database", {
            dependencies: ["core"],
            onInit: async () => {
                order.push("database");
            }
        });

        const api = makeModule("api", {
            dependencies: ["database"],
            onInit: async () => {
                order.push("api");
            }
        });

        // Register in reverse dependency order
        runtime.registerModule(api);
        runtime.registerModule(database);
        runtime.registerModule(core);

        await runtime.initialize();

        expect(order).toEqual([
            "core",
            "database",
            "api"
        ]);
    });

    it("throws when a module dependency is not registered", async () => {
        const api = makeModule("api", {
            dependencies: ["database"]
        });

        runtime.registerModule(api);

        await expect(
            runtime.initialize()
        ).rejects.toThrow(
            "Module 'api' depends on 'database', which is not registered."
        );
    });

    it("throws when module dependencies contain a circular dependency", async () => {
        const moduleA = makeModule("A", {
            dependencies: ["B"]
        });

        const moduleB = makeModule("B", {
            dependencies: ["A"]
        });

        runtime.registerModule(moduleA);
        runtime.registerModule(moduleB);

        await expect(
            runtime.initialize()
        ).rejects.toThrow(
            "Circular module dependency detected"
        );
    });

    // -- Shutdown --

    it("transitions to Stopped after shutdown()", async () => {
        await runtime.initialize();
        await runtime.shutdown();

        expect(runtime.getState()).toBe(
            RuntimeState.Stopped
        );
    });

    it("calls onDestroy on each module during shutdown", async () => {
        const mod = makeModule("alpha");

        runtime.registerModule(mod);

        await runtime.initialize();
        await runtime.shutdown();

        expect(
            mod.onDestroy
        ).toHaveBeenCalledOnce();
    });

    it("calls onDestroy in reverse registration order", async () => {
        const order: string[] = [];

        const a = makeModule("alpha", {
            onDestroy: async () => {
                order.push("alpha");
            }
        });

        const b = makeModule("beta", {
            onDestroy: async () => {
                order.push("beta");
            }
        });

        runtime.registerModule(a);
        runtime.registerModule(b);

        await runtime.initialize();
        await runtime.shutdown();

        expect(order).toEqual([
            "beta",
            "alpha"
        ]);
    });

    it("is idempotent - second shutdown() call is a no-op", async () => {
        const mod = makeModule("alpha");

        runtime.registerModule(mod);

        await runtime.initialize();
        await runtime.shutdown();
        await runtime.shutdown();

        expect(
            mod.onDestroy
        ).toHaveBeenCalledOnce();

        expect(runtime.getState()).toBe(
            RuntimeState.Stopped
        );
    });

    it("shutdown() is a no-op when not Running", async () => {
        await runtime.shutdown();

        expect(runtime.getState()).toBe(
            RuntimeState.Created
        );
    });

    // -- Container / EventBus access --

    it("exposes a non-null container", () => {
        expect(
            runtime.getContainer()
        ).toBeDefined();
    });

    it("exposes a non-null event bus", () => {
        expect(
            runtime.getEventBus()
        ).toBeDefined();
    });

    it("resolve() delegates to the internal container", () => {
        const token = Symbol("MyService");

        class MyService {}

        runtime
            .getContainer()
            .registerSingleton(
                token,
                MyService
            );

        const instance =
            runtime.resolve<MyService>(
                token
            );

        expect(instance).toBeInstanceOf(
            MyService
        );
    });

    // -- SDS section 1: 500ms initialization budget --

    it(
        "initializes within 500ms (SDS section 1 performance constraint)",
        async () => {
            for (let i = 0; i < 5; i++) {
                runtime.registerModule(
                    makeModule(`module-${i}`)
                );
            }

            const start = Date.now();

            await runtime.initialize();

            const elapsed =
                Date.now() - start;

            expect(elapsed).toBeLessThan(500);
        }
    );

    // -- Lifecycle events --

    it("publishes KernelInitializedEvent after successful initialization", async () => {
        const mod = makeModule("alpha");

        runtime.registerModule(mod);

        const received: any[] = [];
        runtime.getEventBus().subscribe("KernelInitializedEvent", {
            handle: async (event: any) => {
                received.push(event);
            }
        });

        await runtime.initialize();

        expect(received).toHaveLength(1);
        expect(received[0].eventType).toBe("KernelInitializedEvent");
        expect(received[0].registeredModulesCount).toBe(1);
    });

    it("publishes ModuleLoadedEvent for each initialized module", async () => {
        const alpha = makeModule("alpha");
        const beta = makeModule("beta");

        runtime.registerModule(alpha);
        runtime.registerModule(beta);

        const received: string[] = [];
        runtime.getEventBus().subscribe("ModuleLoadedEvent", {
            handle: async (event: any) => {
                received.push(event.moduleName);
            }
        });

        await runtime.initialize();

        expect(received).toEqual(["alpha", "beta"]);
    });

    it("publishes KernelShutdownEvent after shutdown", async () => {
        const mod = makeModule("alpha");

        runtime.registerModule(mod);

        await runtime.initialize();

        const received: any[] = [];
        runtime.getEventBus().subscribe("KernelShutdownEvent", {
            handle: async (event: any) => {
                received.push(event);
            }
        });

        await runtime.shutdown();

        expect(received).toHaveLength(1);
        expect(received[0].eventType).toBe("KernelShutdownEvent");
    });

});