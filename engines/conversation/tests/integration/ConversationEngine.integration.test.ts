import { describe, it, expect, vi } from "vitest";
import { ConversationEngine } from "../../src/Presentation/ConversationEngine";
import type { IEventBus } from "@nova-x-ai/core";
import { AIRouter, FakeAiProvider } from "@nova-x-ai/ai-router";
import { IConversationContextBuilder } from "../../src/Domain/Services/ConversationContextBuilder";

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

    it("should propagate context blocks into AI Router request", async () => {
        const router = new AIRouter();
        let capturedRequest: any;
        router.registerProvider({
            id: { value: "fake" },
            name: "Fake",
            capabilities: { supportsStreaming: true, supportsTools: false, maxContextTokens: 4096, supportedModels: ["fake"] },
            isAvailable: () => true,
            getHealth: () => ({ status: "healthy", failureCount: 0, lastFailure: 0 }),
            executePrompt: async (request: any) => {
                capturedRequest = request;
                return { content: "Echo", model: request.model, providerId: "fake", usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 }, finishReason: "stop", latencyMs: 1 };
            },
            executePromptStream: async function* () {},
            markHealthy: () => {},
            markUnhealthy: () => {},
            getBudget: () => ({ validate: () => {} })
        } as any, 1, true);

        const contextBuilder = {
            buildContext: async () => ({
                memoryContext: "Memory: test memory",
                emotionContext: "Emotion: happy",
                relationshipContext: "Relationship: friend",
                worldContext: "World: earth",
                storyContext: "Story: hero"
            })
        } as unknown as IConversationContextBuilder;

        const engine = new ConversationEngine(eventBus, router, contextBuilder);
        await engine.startSession({
            conversationId: "conv-ctx",
            ownerId: "char-1",
            participantIds: ["char-1"],
            claims: { roles: ["user"], permissions: [] }
        });
        await engine.postMessage({
            conversationId: "conv-ctx",
            sessionId: "session-1",
            authorId: "char-1",
            content: "Hello",
            role: "user",
            claims: { roles: ["user"], permissions: [] }
        });
        await engine.executeTurn({
            conversationId: "conv-ctx",
            sessionId: "session-1",
            requesterId: "char-1",
            claims: { roles: ["user"], permissions: [] }
        });

        expect(capturedRequest).toBeDefined();
        expect(capturedRequest.context.systemPrompt).toContain("Memory: test memory");
        expect(capturedRequest.context.systemPrompt).toContain("Emotion: happy");
        expect(capturedRequest.context.systemPrompt).toContain("Relationship: friend");
        expect(capturedRequest.context.systemPrompt).toContain("World: earth");
        expect(capturedRequest.context.systemPrompt).toContain("Story: hero");
        expect(capturedRequest.context.memoryContext).toBe("Memory: test memory");
        expect(capturedRequest.context.emotionContext).toBe("Emotion: happy");
    });

    it("should handle missing optional context safely", async () => {
        const router = new AIRouter();
        let capturedRequest: any;
        router.registerProvider({
            id: { value: "fake" },
            name: "Fake",
            capabilities: { supportsStreaming: true, supportsTools: false, maxContextTokens: 4096, supportedModels: ["fake"] },
            isAvailable: () => true,
            getHealth: () => ({ status: "healthy", failureCount: 0, lastFailure: 0 }),
            executePrompt: async (request: any) => {
                capturedRequest = request;
                return { content: "Echo", model: request.model, providerId: "fake", usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 }, finishReason: "stop", latencyMs: 1 };
            },
            executePromptStream: async function* () {},
            markHealthy: () => {},
            markUnhealthy: () => {},
            getBudget: () => ({ validate: () => {} })
        } as any, 1, true);

        const engine = new ConversationEngine(eventBus, router);
        await engine.startSession({
            conversationId: "conv-miss",
            ownerId: "char-2",
            participantIds: ["char-2"],
            claims: { roles: ["user"], permissions: [] }
        });
        await engine.postMessage({
            conversationId: "conv-miss",
            sessionId: "session-1",
            authorId: "char-2",
            content: "Hello",
            role: "user",
            claims: { roles: ["user"], permissions: [] }
        });
        await engine.executeTurn({
            conversationId: "conv-miss",
            sessionId: "session-1",
            requesterId: "char-2",
            claims: { roles: ["user"], permissions: [] }
        });

        expect(capturedRequest).toBeDefined();
        expect(capturedRequest.context.systemPrompt).toBe("You are a helpful assistant.");
        expect(capturedRequest.context.memoryContext).toBeUndefined();
        expect(capturedRequest.context.emotionContext).toBeUndefined();
    });
});
