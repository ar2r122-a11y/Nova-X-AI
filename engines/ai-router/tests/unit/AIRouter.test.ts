/**
 * Nova X AI
 * AI Router
 * Unit tests: AIRouter
 */
import { describe, it, expect, vi } from "vitest";
import { AIRouter } from "../../src/Application/AIRouter";
import type { IAiProvider, ProviderCapabilities, PromptResult, StreamChunk } from "../../src/Domain/Services/IAiProvider";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { ProviderHealth, ProviderHealthStatus } from "../../src/Domain/ValueObjects/ProviderHealth";

function makeProvider(
    id: string,
    overrides: Partial<IAiProvider> = {}
): IAiProvider {
    const capabilities: ProviderCapabilities = {
        supportsStreaming: true,
        supportsTools: false,
        maxContextTokens: 4096,
        supportedModels: [`model-${id}`]
    };

    return {
        id: new ProviderId(id),
        name: `Provider ${id}`,
        capabilities,
        isAvailable: () => true,
        getHealth: () => new ProviderHealth(ProviderHealthStatus.Healthy),
        executePrompt: vi.fn().mockResolvedValue({
            content: "response",
            model: `model-${id}`,
            providerId: id,
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            finishReason: "stop",
            latencyMs: 100
        } as PromptResult),
        executePromptStream: async function* () {
            yield { content: "chunk", delta: "chunk", isLast: true } as StreamChunk;
        },
        markHealthy: vi.fn(),
        markUnhealthy: vi.fn(),
        getBudget: () => ({ maxTokens: 4096, reservedTokens: 1024, contextTokens: 4096 } as any),
        ...overrides
    };
}

describe("AIRouter", () => {

    it("registers a provider and emits event", () => {
        const router = new AIRouter();
        const provider = makeProvider("a");

        router.registerProvider(provider, 0, true);

        const providers = router.getProviders();
        expect(providers).toHaveLength(1);
        expect(providers[0].id).toBe("a");
    });

    it("unregisters a provider", () => {
        const router = new AIRouter();
        const provider = makeProvider("a");

        router.registerProvider(provider);
        expect(router.getProviders()).toHaveLength(1);

        const removed = router.unregisterProvider("a");
        expect(removed).toBe(true);
        expect(router.getProviders()).toHaveLength(0);
    });

    it("throws when registering duplicate provider", () => {
        const router = new AIRouter();
        const provider = makeProvider("a");

        router.registerProvider(provider);
        expect(() => router.registerProvider(provider)).toThrow(
            "already registered"
        );
    });

    it("executes prompt with selected provider", async () => {
        const router = new AIRouter();
        const provider = makeProvider("a");

        router.registerProvider(provider);

        const result = await router.executePrompt({
            prompt: "hello",
            model: "model-a",
            maxTokens: 100,
            temperature: 0.7
        });

        expect(result.content).toBe("response");
        expect(result.providerId).toBe("a");
        expect(provider.executePrompt).toHaveBeenCalledOnce();
    });

    it("falls back when primary provider fails", async () => {
        const router = new AIRouter();
        const primary = makeProvider("primary");
        const fallback = makeProvider("fallback");

        primary.executePrompt = vi.fn().mockRejectedValue(new Error("primary failed"));

        router.registerProvider(primary);
        router.registerProvider(fallback);

        const result = await router.executePrompt({
            prompt: "hello",
            model: "model-primary",
            maxTokens: 100,
            temperature: 0.7
        });

        expect(result.content).toBe("response");
        expect(result.providerId).toBe("fallback");
    });

    it("throws when no provider is available", async () => {
        const router = new AIRouter();
        const provider = makeProvider("a");
        provider.isAvailable = () => false;

        router.registerProvider(provider);

        await expect(
            router.executePrompt({
                prompt: "hello",
                model: "model-a",
                maxTokens: 100,
                temperature: 0.7
            })
        ).rejects.toThrow("No AI provider is available");
    });

    it("streams prompt chunks", async () => {
        const router = new AIRouter();
        const provider = makeProvider("a");

        router.registerProvider(provider);

        const chunks: StreamChunk[] = [];
        for await (const chunk of router.executePromptStream({
            prompt: "hello",
            model: "model-a",
            maxTokens: 100,
            temperature: 0.7
        })) {
            chunks.push(chunk);
        }

        expect(chunks).toHaveLength(1);
        expect(chunks[0].content).toBe("chunk");
        expect(chunks[0].isLast).toBe(true);
    });

    it("tracks provider health via circuit breaker", async () => {
        const router = new AIRouter();
        const provider = makeProvider("a");
        provider.executePrompt = vi.fn().mockRejectedValue(new Error("fail"));

        router.registerProvider(provider);

        await expect(
            router.executePrompt({
                prompt: "hello",
                model: "model-a",
                maxTokens: 100,
                temperature: 0.7
            })
        ).rejects.toThrow("fail");

        const health = router.getProviderHealth("a");
        expect(health).toBeDefined();
        expect(health!.isDegraded()).toBe(true);
    });

    it("returns provider info", () => {
        const router = new AIRouter();
        const provider = makeProvider("a");

        router.registerProvider(provider, 10, true);

        const infos = router.getProviders();
        expect(infos[0].name).toBe("Provider a");
        expect(infos[0].priority).toBe(10);
        expect(infos[0].isAvailable).toBe(true);
    });

    it("returns provider model", () => {
        const router = new AIRouter();
        const provider = makeProvider("a");

        router.registerProvider(provider);

        const model = router.getProviderModel("a");
        expect(model).toBeDefined();
        expect(model!.value).toBe("model-a");
        expect(model!.provider).toBe("a");
    });

    it("exposes underlying selector", () => {
        const router = new AIRouter();
        const provider = makeProvider("a");

        router.registerProvider(provider);

        expect(router.getSelector().getProviders()).toHaveLength(1);
    });

});
