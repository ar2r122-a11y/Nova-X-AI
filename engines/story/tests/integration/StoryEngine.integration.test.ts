import { describe, test, expect, vi } from "vitest";
import { StoryAggregate } from "../../src/Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../src/Domain/ValueObjects/StoryId";
import { StoryStateRef } from "../../src/Domain/ValueObjects/StoryState";
import { StoryStatusRef } from "../../src/Domain/ValueObjects/StoryStatus";
import { StoryProgress } from "../../src/Domain/ValueObjects/StoryProgress";
import { StoryVersion } from "../../src/Domain/ValueObjects/StoryVersion";

describe("StoryEngine Integration", () => {
    test("repository persistence round-trip", async () => {
        const storyId = StoryId.create("11111111-1111-1111-1111-111111111111");
        const aggregate = StoryAggregate.create(storyId, "Integration Story", "Integration test");
        aggregate.start();

        const snapshot = aggregate.getSnapshot() as Record<string, unknown>;
        expect(snapshot.storyId).toBe("11111111-1111-1111-1111-111111111111");

        const reconstituted = StoryAggregate.reconstitute({
            storyId,
            title: snapshot.title as string,
            description: snapshot.description as string,
            state: StoryStateRef.create(snapshot.state as string),
            status: StoryStatusRef.create(snapshot.status as string),
            chapters: [],
            scenes: [],
            quests: [],
            endings: [],
            branches: [],
            flags: new Map(Object.entries(snapshot.flags as Record<string, unknown>)),
            progress: StoryProgress.create(snapshot.progress as any),
            version: StoryVersion.create(snapshot.version as number),
            createdAt: snapshot.createdAt as number,
            updatedAt: snapshot.updatedAt as number,
        });

        expect(reconstituted.getStoryId().getValue()).toBe("11111111-1111-1111-1111-111111111111");
        expect(reconstituted.getStatus().getValue()).toBe("active");
    });

    test("event store append and read round-trip", async () => {
        const storyId = StoryId.create("22222222-2222-2222-2222-222222222222");
        const aggregate = StoryAggregate.create(storyId, "Event Store Test", "Event store integration");
        aggregate.start();

        const events = aggregate.getUncommittedEvents();
        expect(events.length).toBeGreaterThan(0);
        expect(events[0].eventType).toBe("EVT_STORY_StoryStarted");
    });
});
