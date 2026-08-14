import { describe, test, expect } from "vitest";
import { PluginEngineModule } from "../../../src/Presentation/PluginEngineModule";

describe("PluginEngineModule", () => {
    test("has correct module name", () => {
        const module = new PluginEngineModule();
        expect(module.moduleName).toBe("@nova-x-ai/plugin");
    });

    test("initializes successfully", async () => {
        const module = new PluginEngineModule();
        await module.onInit();
        expect(module.getEngine()).not.toBeNull();
    });

    test("destroys successfully", async () => {
        const module = new PluginEngineModule();
        await module.onInit();
        await module.onDestroy();
        expect(module.getEngine()).toBeNull();
    });
});
