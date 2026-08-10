import { describe, it, expect } from "vitest";
import { SecurityEngineModule } from "../../src/Presentation/SecurityEngineModule.ts";

describe("SecurityEngineModule", () => {
    it("should have module name", () => {
        const module = new SecurityEngineModule();
        expect(module.moduleName).toBe("@nova-x-ai/security");
    });

    it("should configure services", async () => {
        const module = new SecurityEngineModule();
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
        expect(module.moduleName).toBe("@nova-x-ai/security");
    });

    it("should initialize without error", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        expect(module.moduleName).toBe("@nova-x-ai/security");
        await module.onDestroy();
    });
});
