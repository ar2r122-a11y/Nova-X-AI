import { describe, it, expect } from "vitest";
import { StoryAggregate } from "../../../src/Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";
import { SceneId } from "../../../src/Domain/ValueObjects/SceneId";
import { EndingId } from "../../../src/Domain/ValueObjects/EndingId";
import { Ending } from "../../../src/Domain/Entities/Ending";
import { EndingTypeRef } from "../../../src/Domain/ValueObjects/EndingType";

describe("StoryAggregate FSM", () => {
    it("should transition draft -> active -> completed", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test", "Desc");
        aggregate.commitEvents();

        aggregate.start();
        expect(aggregate.getStatus().getValue()).toBe("active");
        expect(aggregate.getState().getValue()).toBe("in_progress");

        const ending = Ending.create({
            storyId,
            title: "Good Ending",
            description: "A good ending",
            type: EndingTypeRef.initial(),
            isUnlocked: true,
        });
        aggregate.addEnding(ending);

        aggregate.completeStory(ending.getId());
        expect(aggregate.getStatus().getValue()).toBe("completed");
        expect(aggregate.getState().getValue()).toBe("completed");
    });

    it("should transition draft -> active -> failed", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test", "Desc");
        aggregate.commitEvents();

        aggregate.start();
        aggregate.commitEvents();

        aggregate.failStory("Test failure");
        expect(aggregate.getStatus().getValue()).toBe("failed");
        expect(aggregate.getState().getValue()).toBe("failed");
    });

    it("should transition active -> paused -> active", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test", "Desc");
        aggregate.commitEvents();

        aggregate.start();
        aggregate.commitEvents();

        aggregate.pause();
        expect(aggregate.getStatus().getValue()).toBe("paused");

        aggregate.resume();
        expect(aggregate.getStatus().getValue()).toBe("active");
    });

    it("should not start from completed", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test", "Desc");
        aggregate.commitEvents();
        aggregate.start();
        aggregate.commitEvents();

        const ending = Ending.create({
            storyId,
            title: "Good Ending",
            description: "A good ending",
            type: EndingTypeRef.initial(),
            isUnlocked: true,
        });
        aggregate.addEnding(ending);
        aggregate.completeStory(ending.getId());
        aggregate.commitEvents();

        expect(() => aggregate.start()).toThrow("Cannot start story from status: completed");
    });

    it("should not advance scenes from failed", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test", "Desc");
        aggregate.commitEvents();
        aggregate.start();
        aggregate.commitEvents();
        aggregate.failStory("Test");

        expect(() => aggregate.advanceScene(SceneId.create("123e4567-e89b-12d3-a456-426614174002"))).toThrow("Story is not active or paused: failed");
    });
});
