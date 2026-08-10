import { describe, it, expect } from "vitest";
import { CrossEngineSecurityCoordinator } from "../../src/Infrastructure/Coordinator/CrossEngineSecurityCoordinator";

describe("CrossEngineSecurityCoordinator", () => {
    it("should initialize coordinator", async () => {
        const coordinator = new CrossEngineSecurityCoordinator();
        const eventBus = {
            subscribe: () => {}
        };
        coordinator.setEventBus(eventBus as any);
        await coordinator.initialize();
        expect(coordinator.isInitialized()).toBe(true);
    });

    it("should intercept events when initialized", async () => {
        const coordinator = new CrossEngineSecurityCoordinator();
        const eventBus = {
            subscribe: () => {}
        };
        coordinator.setEventBus(eventBus as any);
        coordinator.setSecurity({
            getSessions: () => [{ identityId: "id-1", status: "active" }]
        } as any);
        await coordinator.initialize();

        const event = { eventType: "REQ_SEC_AuthenticateTokenCommand", identityId: "id-1", timestamp: Date.now(), correlationId: "corr-1" };
        const result = await coordinator.interceptAndValidate(event as any);
        expect(result).toBe(true);
    });

    it("should reject unauthorized events", async () => {
        const coordinator = new CrossEngineSecurityCoordinator();
        const eventBus = {
            subscribe: () => {}
        };
        coordinator.setEventBus(eventBus as any);
        coordinator.setSecurity({
            getSessions: () => []
        } as any);
        await coordinator.initialize();

        const event = { eventType: "REQ_SEC_AuthenticateTokenCommand", identityId: "id-1", timestamp: Date.now(), correlationId: "corr-1" };
        const result = await coordinator.interceptAndValidate(event as any);
        expect(result).toBe(false);
    });
});
