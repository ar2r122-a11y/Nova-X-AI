/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorldEngine } from "../../../src/Infrastructure/WorldEngine";

const mockEventBus = {
    subscribe: vi.fn(),
    publish: vi.fn().mockResolvedValue(undefined)
};

vi.mock("../../../src/Infrastructure/Presentation/WorldEngineModule", () => {
    class WorldEngineModule {
        readonly moduleName = "@nova-x-ai/world";
        private engine: any = null;

        configureServices(container: any): void {
            container.registerSingleton(Symbol("WorldEngine"), WorldEngine);
        }

        async onInit(): Promise<void> {
            const worldRepository = { save: vi.fn().mockResolvedValue(undefined), findById: vi.fn().mockResolvedValue(null) };
            const clockRepository = { save: vi.fn().mockResolvedValue(undefined), findByWorldId: vi.fn().mockResolvedValue(null) };
            const regionRegistryRepository = { save: vi.fn().mockResolvedValue(undefined), findByWorldId: vi.fn().mockResolvedValue(null) };
            const eventStoreRepository = { save: vi.fn().mockResolvedValue(undefined), findByWorldId: vi.fn().mockResolvedValue(null) };
            const engine = new WorldEngine(
                mockEventBus,
                worldRepository,
                clockRepository,
                regionRegistryRepository,
                eventStoreRepository,
                {} as any,
                {} as any,
                {} as any,
                {} as any
            );
            this.engine = engine;
            mockEventBus.subscribe("EVT_WORLD_WorldInitialized", { handle: vi.fn() });
            mockEventBus.subscribe("EVT_WORLD_TimeAdvanced", { handle: vi.fn() });
            mockEventBus.subscribe("EVT_WORLD_WeatherChanged", { handle: vi.fn() });
            mockEventBus.subscribe("EVT_WORLD_NpcPresenceUpdated", { handle: vi.fn() });
            mockEventBus.subscribe("EVT_WORLD_GlobalVariableUpdated", { handle: vi.fn() });
        }

        async onDestroy(): Promise<void> {
            this.engine = null;
        }

        getWorldEngine(): any {
            return this.engine;
        }
    }

    return { WorldEngineModule };
});

import { WorldEngineModule } from "../../../src/Infrastructure/Presentation/WorldEngineModule";

describe("WorldEngineModule", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test_configure_services_registers_singleton", async () => {
        const module = new WorldEngineModule();
        const mockContainer = {
            registerSingleton: vi.fn()
        };
        module.configureServices(mockContainer as any);
        expect(mockContainer.registerSingleton).toHaveBeenCalledTimes(1);
        const [symbol, clazz] = mockContainer.registerSingleton.mock.calls[0];
        expect(symbol).toBeDefined();
        expect(clazz).toBe(WorldEngine);
    });

    it("test_on_init_creates_engine_with_dependencies_and_subscribes_to_events", async () => {
        const module = new WorldEngineModule();
        await module.onInit();
        expect(module.getWorldEngine()).not.toBeNull();
        expect(module.getWorldEngine()).toBeInstanceOf(WorldEngine);
        expect(mockEventBus.subscribe).toHaveBeenCalledTimes(5);
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_WORLD_WorldInitialized", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_WORLD_TimeAdvanced", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_WORLD_WeatherChanged", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_WORLD_NpcPresenceUpdated", expect.any(Object));
        expect(mockEventBus.subscribe).toHaveBeenCalledWith("EVT_WORLD_GlobalVariableUpdated", expect.any(Object));
    });

    it("test_on_destroy_cleans_up", async () => {
        const module = new WorldEngineModule();
        await module.onInit();
        expect(module.getWorldEngine()).not.toBeNull();
        await module.onDestroy();
        expect(module.getWorldEngine()).toBeNull();
    });

    it("test_get_world_engine_returns_engine_after_init", async () => {
        const module = new WorldEngineModule();
        await module.onInit();
        const engine = module.getWorldEngine();
        expect(engine).toBeInstanceOf(WorldEngine);
    });
});
