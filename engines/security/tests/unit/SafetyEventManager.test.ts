import { describe, it, expect } from "vitest";
import { SafetyEventManager } from "../../src/Infrastructure/Safety/SafetyEventManager";

describe("SafetyEventManager", () => {
    const manager = new SafetyEventManager();

    it("should log and retrieve safety events", async () => {
        const event = await manager.logEvent({
            eventType: "injection_attempt",
            severity: "warning",
            source: "conversation-engine",
            identityId: "id-1",
            resource: "prompt",
            action: "sanitize",
            details: { pattern: "{{injection}}" }
        });

        expect(event.eventId).toBeDefined();
        expect(event.timestamp).toBeGreaterThan(0);

        const events = await manager.getEvents("id-1");
        expect(events).toHaveLength(1);
        expect(events[0].eventType).toBe("injection_attempt");
    });

    it("should filter events by severity", async () => {
        await manager.logEvent({
            eventType: "test-1",
            severity: "info",
            source: "test",
            resource: "r1",
            action: "a1",
            details: {}
        });

        await manager.logEvent({
            eventType: "test-2",
            severity: "error",
            source: "test",
            resource: "r2",
            action: "a2",
            details: {}
        });

        const errors = await manager.getEvents(undefined, "error");
        expect(errors.filter(e => e.severity === "error")).toHaveLength(1);
    });

    it("should respect limit", async () => {
        for (let i = 0; i < 5; i++) {
            await manager.logEvent({
                eventType: `test-${i}`,
                severity: "info",
                source: "test",
                resource: `r-${i}`,
                action: `a-${i}`,
                details: {}
            });
        }

        const events = await manager.getEvents(undefined, undefined, 3);
        expect(events).toHaveLength(3);
    });
});
