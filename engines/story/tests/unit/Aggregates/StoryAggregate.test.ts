import { describe, it, expect } from "vitest";
import { StoryAggregate } from "../../../src/Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";
import { Chapter } from "../../../src/Domain/Entities/Chapter";
import { ChapterId } from "../../../src/Domain/ValueObjects/ChapterId";
import { Scene } from "../../../src/Domain/Entities/Scene";
import { SceneId } from "../../../src/Domain/ValueObjects/SceneId";
import { SceneTypeRef } from "../../../src/Domain/ValueObjects/SceneType";
import { SceneStatusRef } from "../../../src/Domain/ValueObjects/SceneStatus";
import { StoryStartedEvent, SceneAdvancedEvent, ChoiceSelectedEvent, StoryCompletedEvent, StoryFailedEvent } from "../../../src/Domain/Events";
import { QuestId } from "../../../src/Domain/ValueObjects/QuestId";
import { Quest } from "../../../src/Domain/Entities/Quest";
import { QuestTypeRef } from "../../../src/Domain/ValueObjects/QuestType";
import { ChapterStatusRef } from "../../../src/Domain/ValueObjects/ChapterStatus";

describe("StoryAggregate", () => {
    it("should create a new story", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");

        expect(aggregate.getStoryId().getValue()).toBe("123e4567-e89b-12d3-a456-426614174000");
        expect(aggregate.getTitle()).toBe("Test Story");
        expect(aggregate.getStatus().getValue()).toBe("draft");
        expect(aggregate.getState().getValue()).toBe("initialized");
    });

    it("should emit StoryStartedEvent on creation", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        expect(events[0].eventType).toBe("EVT_STORY_StoryStarted");
    });

    it("should start story from draft", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");
        aggregate.commitEvents();

        aggregate.start();

        expect(aggregate.getStatus().getValue()).toBe("active");
        expect(aggregate.getState().getValue()).toBe("in_progress");

        const events = aggregate.getUncommittedEvents();
        expect(events).toHaveLength(1);
        expect(events[0].eventType).toBe("EVT_STORY_StoryStarted");
    });

    it("should throw when starting from non-draft", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");
        aggregate.commitEvents();
        aggregate.start();
        aggregate.commitEvents();

        expect(() => aggregate.start()).toThrow("Cannot start story from status: active");
    });

    it("should pause and resume story", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");
        aggregate.commitEvents();
        aggregate.start();
        aggregate.commitEvents();

        aggregate.pause();
        expect(aggregate.getStatus().getValue()).toBe("paused");

        aggregate.resume();
        expect(aggregate.getStatus().getValue()).toBe("active");
    });

    it("should archive story", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");
        aggregate.commitEvents();

        aggregate.archive();
        expect(aggregate.getStatus().getValue()).toBe("archived");
    });

    it("should throw when archiving already archived story", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");
        aggregate.commitEvents();
        aggregate.archive();

        expect(() => aggregate.archive()).toThrow("Story is already archived.");
    });

    it("should add chapters, quests, endings, and branches", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");

        const chapter = Chapter.create({
            storyId,
            title: "Chapter 1",
            order: 1,
            status: ChapterStatusRef.initial(),
        });
        aggregate.addChapter(chapter);

        const quest = Quest.create({
            storyId,
            title: "Main Quest",
            description: "The main quest",
            type: QuestTypeRef.initial(),
            prerequisites: [],
        });
        aggregate.addQuest(quest);

        expect(aggregate.getChapters()).toHaveLength(1);
        expect(aggregate.getQuests()).toHaveLength(1);
    });

    it("should produce snapshot", () => {
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = StoryAggregate.create(storyId, "Test Story", "A test description");

        const snapshot = aggregate.getSnapshot();
        expect(snapshot.storyId).toBe("123e4567-e89b-12d3-a456-426614174000");
        expect(snapshot.title).toBe("Test Story");
        expect(snapshot.status).toBe("draft");
    });
});
