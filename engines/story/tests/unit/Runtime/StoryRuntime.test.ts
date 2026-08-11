import { describe, test, expect, vi } from "vitest";
import { RuntimeState } from "../../../src/Domain/ValueObjects/RuntimeState";
import { StoryRuntime } from "../../../src/Application/Services/StoryRuntime";
import { StoryAggregate } from "../../../src/Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";

describe("StoryRuntime", () => {
    const mockEventBus = { publish: vi.fn() } as any;
    const mockStoryRepository = {
        getAll: vi.fn(),
        getById: vi.fn(),
        save: vi.fn(),
    } as any;

    const runtime = new StoryRuntime(mockEventBus, mockStoryRepository);

    test("initializes to active state", async () => {
        await runtime.initialize();
        expect(runtime.getRuntimeState()).toBe(RuntimeState.Active);
    });

    test("starts and stops a story", async () => {
        await runtime.startStory("11111111-1111-1111-1111-111111111111");
        expect(runtime.getActiveStories()).toContain("11111111-1111-1111-1111-111111111111");

        await runtime.stopStory("11111111-1111-1111-1111-111111111111");
        expect(runtime.getActiveStories()).not.toContain("11111111-1111-1111-1111-111111111111");
    });

    test("pauses and resumes a story", async () => {
        await runtime.startStory("22222222-2222-2222-2222-222222222222");
        await runtime.pauseStory("22222222-2222-2222-2222-222222222222");
        await runtime.resumeStory("22222222-2222-2222-2222-222222222222");
        expect(runtime.getRuntimeState()).toBe(RuntimeState.Active);
    });

    test("shutdown clears active stories", async () => {
        await runtime.startStory("33333333-3333-3333-3333-333333333333");
        await runtime.shutdown();
        expect(runtime.getActiveStories()).toEqual([]);
        expect(runtime.getRuntimeState()).toBe(RuntimeState.Terminated);
    });
});
