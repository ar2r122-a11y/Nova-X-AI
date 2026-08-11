import { describe, test, expect } from "vitest";
import { EventUpcaster } from "../../../src/Domain/Evolution/EventUpcaster";
import { StoryEvent } from "../../../src/Domain/Events/StoryEvent";

describe("EventUpcaster", () => {
    test("upcasts event through registered upcasters", () => {
        const upcaster = new EventUpcaster();
        upcaster.register({
            fromVersion: 1,
            toVersion: 2,
            upcast: (event) => ({ ...event, schemaVersion: 2 }),
        });

        const event: StoryEvent = {
            streamId: "stream-1",
            version: 1,
            eventType: "EVT_STORY_StoryStarted",
            payload: {},
            timestamp: 1,
            correlationId: "corr-1",
            causationId: null,
            metadata: {},
            schemaVersion: 1,
        };

        const result = upcaster.upcast(event, 1, 2);
        expect(result.schemaVersion).toBe(2);
    });

    test("returns original event when no upcasters match", () => {
        const upcaster = new EventUpcaster();
        const event: StoryEvent = {
            streamId: "stream-1",
            version: 1,
            eventType: "EVT_STORY_StoryStarted",
            payload: {},
            timestamp: 1,
            correlationId: "corr-1",
            causationId: null,
            metadata: {},
            schemaVersion: 1,
        };

        const result = upcaster.upcast(event, 1, 1);
        expect(result.schemaVersion).toBe(1);
    });
});
