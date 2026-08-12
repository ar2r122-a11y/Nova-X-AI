import { describe, it, expect, vi } from "vitest";
import type { IEventBus } from "@nova-x-ai/core";
import { StartSessionCommandHandler } from "../../../src/Application/Handlers/StartSessionCommandHandler";
import { StartSessionCommand } from "../../../src/Application/Commands/StartSessionCommand";
import { InMemoryConversationRepository } from "../../../src/Infrastructure/Persistence/InMemoryConversationRepository";
import { ConversationQuotaPolicy } from "../../../src/Domain/Policies/ConversationQuotaPolicy";

describe("StartSessionCommandHandler", () => {
    it("should start a new session", async () => {
        const eventBus = { publish: vi.fn() } as unknown as IEventBus;
        const repository = new InMemoryConversationRepository();
        const quotaPolicy = new ConversationQuotaPolicy(10);
        const handler = new StartSessionCommandHandler(eventBus, repository, quotaPolicy);

        const command = new StartSessionCommand("conv-1", "user-1", ["user-1"], { roles: ["user"], permissions: [] });
        const result = await handler.handle(command);

        expect(result.conversationId).toBe("conv-1");
        expect(result.participantIds).toEqual(["user-1"]);
        expect(eventBus.publish).toHaveBeenCalled();
    });

    it("should reject empty conversationId", async () => {
        const eventBus = { publish: vi.fn() } as unknown as IEventBus;
        const repository = new InMemoryConversationRepository();
        const quotaPolicy = new ConversationQuotaPolicy(10);
        const handler = new StartSessionCommandHandler(eventBus, repository, quotaPolicy);

        const command = new StartSessionCommand("", "user-1", ["user-1"], { roles: ["user"], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow();
    });
});
