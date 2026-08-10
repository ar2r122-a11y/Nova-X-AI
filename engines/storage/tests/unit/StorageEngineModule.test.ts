import { describe, it, expect } from "vitest";
import { StorageEngineModule } from "../../src/Presentation/StorageEngineModule.ts";
import type { IStorageEngine } from "../../src/Contracts/index.ts";

describe("StorageEngineModule", () => {
    it("should have module name", () => {
        const module = new StorageEngineModule();
        expect(module.moduleName).toBe("@nova-x-ai/storage");
    });

    it("should configure services", () => {
        const module = new StorageEngineModule();
        const container = {
            registerSingleton: () => {},
            registerTransient: () => {},
            registerScoped: () => {},
            registerInstance: () => {},
            isRegistered: () => false,
            resolve: () => ({} as any),
            remove: () => {},
            clear: () => {},
            createScope: () => ({} as any),
            getRegisteredServices: () => []
        } as any;
        module.configureServices(container);
        expect(module.moduleName).toBe("@nova-x-ai/storage");
    });
});
