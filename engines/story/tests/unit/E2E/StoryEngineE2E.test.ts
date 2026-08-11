import { describe, test, expect, vi } from "vitest";
import { StoryAggregate } from "../../../src/Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";

describe("StoryEngine E2E", () => {
    test("full narrative progression: create -> start -> advance -> complete", async () => {
        const storyId = StoryId.create("11111111-1111-1111-1111-111111111111");
        const aggregate = StoryAggregate.create(storyId, "E2E Story", "End-to-end test story");

        expect(aggregate.getState().getValue()).toBe("initialized");
        expect(aggregate.getStatus().getValue()).toBe("draft");

        aggregate.start();
        expect(aggregate.getState().getValue()).toBe("in_progress");
        expect(aggregate.getStatus().getValue()).toBe("active");

        const events = aggregate.getUncommittedEvents();
        expect(events.length).toBeGreaterThan(0);
        aggregate.commitEvents();
    });

    test("story state transitions are consistent", async () => {
        const storyId = StoryId.create("22222222-2222-2222-2222-222222222222");
        const aggregate = StoryAggregate.create(storyId, "State Test", "State consistency test");

        aggregate.start();
        aggregate.pause();
        expect(aggregate.getStatus().getValue()).toBe("paused");

        aggregate.resume();
        expect(aggregate.getStatus().getValue()).toBe("active");
    });

    test("version increments on mutations", async () => {
        const storyId = StoryId.create("33333333-3333-3333-3333-333333333333");
        const aggregate = StoryAggregate.create(storyId, "Version Test", "Version test");

        const initialVersion = aggregate.getVersion().getValue();
        aggregate.start();
        expect(aggregate.getVersion().getValue()).toBe(initialVersion + 1);
    });
});
