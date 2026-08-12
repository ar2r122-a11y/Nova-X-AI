import { describe, it, expect, vi } from "vitest";
import type { IEventBus } from "@nova-x-ai/core";
import { PostMessageCommandHandler } from "../../../src/Application/Handlers/PostMessageCommandHandler";
import { PostMessageCommand } from "../../../src/Application/Commands/PostMessageCommand";
import { InMemoryConversationRepository } from "../../../src/Infrastructure/Persistence/InMemoryConversationRepository";
import { InMemoryMessageRepository } from "../../../src/Infrastructure/Persistence/InMemoryMessageRepository";
import { StartSessionCommandHandler } from "../../../src/Application/Handlers/StartSessionCommandHandler";
import { StartSessionCommand } from "../../../src/Application/Commands/StartSessionCommand";
import { ConversationQuotaPolicy } from "../../../src/Domain/Policies/ConversationQuotaPolicy";

describe("PostMessageCommandHandler", () => {
    it("should post a message", async () => {
        const eventBus = { publish: vi.fn() } as unknown as IEventBus;
        const conversationRepository = new InMemoryConversationRepository();
        const messageRepository = new InMemoryMessageRepository();
        const handler = new PostMessageCommandHandler(eventBus, conversationRepository, messageRepository);

        const startCommand = new StartSessionCommand("conv-1", "user-1", ["user-1"], { roles: ["user"], permissions: [] });
        const startHandler = new StartSessionCommandHandler(eventBus, conversationRepository, new ConversationQuotaPolicy(10));
        await startHandler.handle(startCommand);

        const postCommand = new PostMessageCommand("conv-1", "session-1", "user-1", "Hello", { roles: ["user"], permissions: [] }, "user", undefined);
        const result = await handler.handle(postCommand);

        expect(result.messageId).toBeDefined();
        expect(result.conversationId).toBe("conv-1");
    });
});
