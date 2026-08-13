import { describe, it, expect } from "vitest";
import { ConversationEngine } from "../../src/Presentation/ConversationEngine";
import type { IEventBus } from "@nova-x-ai/core";
import { AIRouter, FakeAiProvider } from "@nova-x-ai/ai-router";

describe("ConversationEngine", () => {
    const eventBus = {
        publish: async () => {},
        subscribe: () => {}
    } as unknown as IEventBus;

    const createEngine = () => {
        const router = new AIRouter();
        router.registerProvider(new FakeAiProvider(), 1, true);
        return new ConversationEngine(eventBus, router);
    };

    it("should create engine", () => {
        const engine = createEngine();
        expect(engine).toBeDefined();
        expect(engine.eventBus).toBe(eventBus);
    });

    it("should start session", async () => {
        const engine = createEngine();
        const result = await engine.startSession({
            conversationId: "conv-1",
            ownerId: "user-1",
            participantIds: ["user-1"],
            initialPrompt: "Hello",
            claims: { roles: ["user"], permissions: [] }
        });
        expect(result.conversationId).toBe("conv-1");
    });

    it("should post message", async () => {
        const engine = createEngine();
        await engine.startSession({
            conversationId: "conv-1",
            ownerId: "user-1",
            participantIds: ["user-1"],
            claims: { roles: ["user"], permissions: [] }
        });
        const message = await engine.postMessage({
            conversationId: "conv-1",
            sessionId: "session-1",
            authorId: "user-1",
            content: "Hello",
            role: "user",
            claims: { roles: ["user"], permissions: [] }
        });
        expect(message.messageId).toBeDefined();
        expect(message.conversationId).toBe("conv-1");
    });

    it("should get conversation", async () => {
        const engine = createEngine();
        await engine.startSession({
            conversationId: "conv-1",
            ownerId: "user-1",
            participantIds: ["user-1"],
            claims: { roles: ["user"], permissions: [] }
        });
        const result = await engine.getConversation({ conversationId: "conv-1", requesterId: "user-1" });
        expect(result).not.toBeNull();
        expect(result?.conversationId).toBe("conv-1");
    });

    it("should return null for non-existent conversation", async () => {
        const engine = createEngine();
        const result = await engine.getConversation({ conversationId: "conv-none", requesterId: "user-1" });
        expect(result).toBeNull();
    });
});
