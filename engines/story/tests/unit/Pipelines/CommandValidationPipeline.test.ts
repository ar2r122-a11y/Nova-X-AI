import { describe, test, expect, vi } from "vitest";
import { CommandValidationPipeline } from "../../../src/Application/Pipelines/CommandValidationPipeline";
import { StorySecurityBoundary } from "../../../src/Infrastructure/Security/StorySecurityBoundary";
import { StorySecurityContext } from "../../../src/Infrastructure/Security/StorySecurityContext";

describe("CommandValidationPipeline", () => {
    const mockEventBus = { publish: vi.fn() } as any;
    const securityBoundary = new StorySecurityBoundary(mockEventBus);
    const pipeline = new CommandValidationPipeline(securityBoundary, mockEventBus);

    test("validates command with matching roles", async () => {
        const command = { constructor: { name: "StartStoryCommand" } };
        const context = {
            correlationId: "corr-1",
            causationId: null,
            nonce: `nonce-${Date.now()}`,
            claims: { roles: ["admin"] },
        };

        const result = await pipeline.validate(command, context);
        expect(result).toBe(command);
    });

    test("rejects unauthorized command", async () => {
        const command = { constructor: { name: "StartStoryCommand" }, claims: { roles: ["admin"] } };
        const context = {
            correlationId: "corr-1",
            causationId: null,
            nonce: `nonce-${Date.now()}`,
            claims: { roles: ["user"] },
        };

        await expect(pipeline.validate(command, context)).rejects.toThrow("Unauthorized");
    });
});
