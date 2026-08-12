import { describe, it, expect, vi } from "vitest";
import type { IEventBus } from "@nova-x-ai/core";
import { InterruptCommandHandler } from "../../../src/Application/Handlers/InterruptCommandHandler";
import { InterruptCommand } from "../../../src/Application/Commands/InterruptCommand";
import { InMemoryConversationRepository } from "../../../src/Infrastructure/Persistence/InMemoryConversationRepository";
import { StartSessionCommandHandler } from "../../../src/Application/Handlers/StartSessionCommandHandler";
import { StartSessionCommand } from "../../../src/Application/Commands/StartSessionCommand";
import { ConversationQuotaPolicy } from "../../../src/Domain/Policies/ConversationQuotaPolicy";

describe("InterruptCommandHandler", () => {
    it("should interrupt a conversation", async () => {
        const eventBus = { publish: vi.fn() } as unknown as IEventBus;
        const repository = new InMemoryConversationRepository();
        const handler = new InterruptCommandHandler(repository);

        const startCommand = new StartSessionCommand("conv-1", "user-1", ["user-1"], { roles: ["user"], permissions: [] });
        const startHandler = new StartSessionCommandHandler(eventBus, repository, new ConversationQuotaPolicy(10));
        await startHandler.handle(startCommand);

        const interruptCommand = new InterruptCommand("conv-1", "session-1", "userInterrupt", "user-1", { roles: ["user"], permissions: [] });
        await handler.handle(interruptCommand);

        const aggregate = await repository.getById("conv-1");
        expect(aggregate?.getState().getValue()).toBe("interrupted");
    });
});
