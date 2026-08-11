import { describe, test, expect, vi } from "vitest";
import { StoryOpenHostService } from "../../../src/Presentation/OpenHost/StoryOpenHostService";
import { StorySecurityBoundary } from "../../../src/Infrastructure/Security/StorySecurityBoundary";
import { StoryEngineAclTranslator } from "../../../src/Infrastructure/ACL/StoryEngineAclTranslator";
import { StorySecurityContext } from "../../../src/Infrastructure/Security/StorySecurityContext";
import { TimelineDto } from "../../../src/Presentation/OpenHost/Dtos/TimelineDto";
import { StoryStateDto } from "../../../src/Presentation/OpenHost/Dtos/StoryStateDto";

describe("StoryOpenHostService", () => {
    const mockEventBus = { publish: vi.fn() } as any;
    const mockStoryEngine = {
        eventStoreRepository: { getStreamEvents: vi.fn() },
        storyRepository: { getById: vi.fn() },
    } as any;
    const securityBoundary = new StorySecurityBoundary(mockEventBus);
    const acl = new StoryEngineAclTranslator();
    const service = new StoryOpenHostService(mockStoryEngine, securityBoundary, acl, mockEventBus);

    test("returns timeline DTO", async () => {
        mockStoryEngine.eventStoreRepository.getStreamEvents.mockResolvedValue([
            { eventType: "EVT_STORY_StoryStarted", timestamp: 1, version: 1 },
        ]);

        const result = await service.getTimeline("story-1", "user-1");
        expect(result).toBeInstanceOf(TimelineDto);
        expect(result.events.length).toBe(1);
    });

    test("returns story state DTO", async () => {
        mockStoryEngine.storyRepository.getById.mockResolvedValue({
            getStoryId: () => ({ getValue: () => "44444444-4444-4444-4444-444444444444" }),
            getStatus: () => ({ getValue: () => "active" }),
            getState: () => ({ getValue: () => "inProgress" }),
            getVersion: () => ({ getValue: () => 1 }),
        });

        const result = await service.getStoryState("44444444-4444-4444-4444-444444444444", "user-1");
        expect(result).toBeInstanceOf(StoryStateDto);
        expect(result.status).toBe("active");
    });

    test("executeCommand returns CommandResultDto", async () => {
        const result = await service.executeCommand({ commandType: "StartStoryCommand" }, "v1", {
            userId: "user-1",
            roles: ["admin"],
            permissions: [],
            correlationId: "corr-1",
            causationId: null,
            nonce: `nonce-${Date.now()}`,
            timestamp: Date.now(),
        } as any);

        expect(result).toHaveProperty("success");
        expect(result).toHaveProperty("correlationId");
    });
});
