import { describe, it, expect } from "vitest";
import { CreateContentBoundaryHandler } from "../../src/Application/Handlers/CreateContentBoundaryHandler";
import { UpdateContentBoundaryHandler } from "../../src/Application/Handlers/UpdateContentBoundaryHandler";
import { CreateAgeControlHandler } from "../../src/Application/Handlers/CreateAgeControlHandler";
import { RegisterProviderPolicyHandler } from "../../src/Application/Handlers/RegisterProviderPolicyHandler";
import { LogSafetyEventHandler } from "../../src/Application/Handlers/LogSafetyEventHandler";

describe("CreateContentBoundaryHandler", () => {
    it("should be instantiable", () => {
        const security = {
            addContentBoundary: async () => {},
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new CreateContentBoundaryHandler(security);
        expect(handler).toBeDefined();
    });
});

describe("UpdateContentBoundaryHandler", () => {
    it("should be instantiable", () => {
        const security = {
            getContentBoundary: () => ({
                boundaryId: "boundary-1",
                name: "test",
                allowedCategories: [],
                blockedCategories: [],
                severityThreshold: "medium"
            }),
            addContentBoundary: async () => {}
        } as any;
        const handler = new UpdateContentBoundaryHandler(security);
        expect(handler).toBeDefined();
    });
});

describe("CreateAgeControlHandler", () => {
    it("should be instantiable", () => {
        const security = {
            addAgeControl: async () => {},
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new CreateAgeControlHandler(security);
        expect(handler).toBeDefined();
    });
});

describe("RegisterProviderPolicyHandler", () => {
    it("should be instantiable", () => {
        const security = {
            addProviderPolicy: async () => {},
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new RegisterProviderPolicyHandler(security);
        expect(handler).toBeDefined();
    });
});

describe("LogSafetyEventHandler", () => {
    it("should be instantiable", () => {
        const security = {
            appendSafetyEvent: async () => {},
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new LogSafetyEventHandler(security);
        expect(handler).toBeDefined();
    });
});
