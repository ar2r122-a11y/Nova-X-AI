import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventBus } from "../../src/events/EventBus";
import type { IDomainEvent, IEventHandler } from "../../src/events/IEventBus";

interface TestEvent extends IDomainEvent {
    readonly eventType: "TestEvent";
    readonly payload: string;
}

function makeTestEvent(payload: string): TestEvent {
    return {
        eventType: "TestEvent",
        timestamp: Date.now(),
        correlationId: "test-correlation-id",
        payload
    };
}

describe("EventBus", () => {

    let bus: EventBus;

    beforeEach(() => {
        bus = new EventBus();
    });

    it("delivers an event to a subscribed handler", async () => {
        const handler = vi.fn().mockResolvedValue(undefined);
        bus.subscribe<TestEvent>("TestEvent", { handle: handler });
        const event = makeTestEvent("hello");
        await bus.publish(event);
        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(event);
    });

    it("delivers an event to multiple subscribers", async () => {
        const h1 = vi.fn().mockResolvedValue(undefined);
        const h2 = vi.fn().mockResolvedValue(undefined);
        bus.subscribe<TestEvent>("TestEvent", { handle: h1 });
        bus.subscribe<TestEvent>("TestEvent", { handle: h2 });
        await bus.publish(makeTestEvent("multi"));
        expect(h1).toHaveBeenCalledOnce();
        expect(h2).toHaveBeenCalledOnce();
    });

    it("does not deliver to handlers subscribed to a different event type", async () => {
        const handler = vi.fn().mockResolvedValue(undefined);
        bus.subscribe("OtherEvent", { handle: handler });
        await bus.publish(makeTestEvent("ignored"));
        expect(handler).not.toHaveBeenCalled();
    });

    it("does not throw when publishing with no subscribers", async () => {
        await expect(
            bus.publish(makeTestEvent("no-subscribers"))
        ).resolves.toBeUndefined();
    });

    it("delivers all events without message loss (SDS section 1 requirement)", async () => {
        const received: string[] = [];
        const handler: IEventHandler<TestEvent> = {
            handle: async (e) => { received.push(e.payload); }
        };
        bus.subscribe<TestEvent>("TestEvent", handler);

        const events = Array.from({ length: 10 }, (_, i) =>
            makeTestEvent(`msg-${i}`)
        );

        for (const e of events) {
            await bus.publish(e);
        }

        expect(received).toHaveLength(10);
        expect(received).toEqual(events.map(e => e.payload));
    });

    it("continues delivering to remaining handlers when one throws", async () => {
        const failing: IEventHandler<TestEvent> = {
            handle: async () => { throw new Error("handler failure"); }
        };
        const succeeding = vi.fn().mockResolvedValue(undefined);

        bus.subscribe<TestEvent>("TestEvent", failing);
        bus.subscribe<TestEvent>("TestEvent", { handle: succeeding });

        await expect(
            bus.publish(makeTestEvent("fault-isolation"))
        ).resolves.toBeUndefined();

        expect(succeeding).toHaveBeenCalledOnce();
    });

});
