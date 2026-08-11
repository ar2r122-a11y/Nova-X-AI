import { describe, test, expect, vi } from "vitest";
import { StoryProgressionSaga } from "../../../src/Domain/Sagas/StoryProgressionSaga";

describe("StoryProgressionSaga", () => {
    const mockEventBus = { publish: vi.fn() } as any;
    const mockStoryRepository = {
        getById: vi.fn(),
        save: vi.fn(),
    } as any;

    const saga = new StoryProgressionSaga(mockEventBus, mockStoryRepository);

    test("initializes and changes state to Running", async () => {
        await saga.initialize("story-1");
        expect(saga.getState()).toBe("Running");
    });

    test("handles event idempotently", async () => {
        const event = {
            eventType: "EVT_STORY_StoryStarted",
            correlationId: "corr-1",
            payload: { storyId: "story-1" },
        };

        await saga.handleEvent(event);
        await saga.handleEvent(event);
        expect(mockEventBus.publish).toHaveBeenCalledTimes(2);
    });

    test("compensates and returns to Running", async () => {
        await saga.compensate("story-1", 1);
        expect(saga.getState()).toBe("Running");
    });
});
