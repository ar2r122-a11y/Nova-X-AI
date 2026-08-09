/**
 * Nova X AI
 * AI Router
 * Unit tests: ProviderSelector
 */
import { describe, it, expect, vi } from "vitest";
import { ProviderSelector } from "../../src/Domain/Services/ProviderSelector";
import type { IAiProvider, ProviderCapabilities, PromptResult } from "../../src/Domain/Services/IAiProvider";
import { ProviderId } from "../../src/Domain/ValueObjects/ProviderId";
import { ProviderHealth, ProviderHealthStatus } from "../../src/Domain/ValueObjects/ProviderHealth";

function makeProvider(
    id: string,
    _overrides: Partial<IAiProvider> = {}
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
            yield { content: "chunk", delta: "chunk", isLast: true };
        },
        markHealthy: vi.fn(),
        markUnhealthy: vi.fn(),
        getBudget: () => ({ maxTokens: 4096, reservedTokens: 1024, contextTokens: 4096 } as any)
    };
}

describe("ProviderSelector", () => {

    it("returns NoProviders when no providers registered", () => {
        const selector = new ProviderSelector(new Map());
        const result = selector.select();
        expect(result.selected).toBeNull();
        expect(result.reason).toBe("NoProviders");
        expect(result.skipped).toHaveLength(0);
    });

    it("selects healthy provider by priority (default)", () => {
        const healthy = makeProvider("a");
        const degraded = makeProvider("b");
        degraded.getHealth = () => new ProviderHealth(ProviderHealthStatus.Degraded, 1, "slow");

        const providers = new Map<string, IAiProvider>([
            ["a", healthy],
            ["b", degraded]
        ]);

        const selector = new ProviderSelector(providers);
        const result = selector.select();

        expect(result.selected).toBe(healthy);
        expect(result.fallbacks).toHaveLength(1);
        expect(result.reason).toBe("Success");
    });

    it("uses hinted provider when available", () => {
        const a = makeProvider("a");
        const b = makeProvider("b");

        const providers = new Map<string, IAiProvider>([
            ["a", a],
            ["b", b]
        ]);

        const selector = new ProviderSelector(providers);
        const result = selector.select({
            providerHint: new ProviderId("b")
        });

        expect(result.selected).toBe(b);
        expect(result.fallbacks).toContain(a);
    });

    it("falls back when hinted provider is unavailable", () => {
        const a = makeProvider("a");
        const b = makeProvider("b");
        b.isAvailable = () => false;

        const providers = new Map<string, IAiProvider>([
            ["a", a],
            ["b", b]
        ]);

        const selector = new ProviderSelector(providers);
        const result = selector.select({
            providerHint: new ProviderId("b")
        });

        expect(result.selected).toBe(a);
        expect(result.skipped).toContain("b");
    });

    it("selects fallback excluding failed provider", () => {
        const a = makeProvider("a");
        const b = makeProvider("b");

        const providers = new Map<string, IAiProvider>([
            ["a", a],
            ["b", b]
        ]);

        const selector = new ProviderSelector(providers);
        const fallback = selector.selectFallback(new ProviderId("a"));

        expect(fallback).toBe(b);
    });

    it("returns null when no fallback available", () => {
        const a = makeProvider("a");
        const providers = new Map<string, IAiProvider>([["a", a]]);

        const selector = new ProviderSelector(providers);
        const fallback = selector.selectFallback(new ProviderId("a"));

        expect(fallback).toBeNull();
    });

    it("excludes providers when specified", () => {
        const a = makeProvider("a");
        const b = makeProvider("b");

        const providers = new Map<string, IAiProvider>([
            ["a", a],
            ["b", b]
        ]);

        const selector = new ProviderSelector(providers);
        const available = selector.getAvailableProviders(["a"]);

        expect(available).toHaveLength(1);
        expect(available[0]).toBe(b);
    });

    it("supports round-robin selection", () => {
        const a = makeProvider("a");
        const b = makeProvider("b");

        const providers = new Map<string, IAiProvider>([
            ["a", a],
            ["b", b]
        ]);

        const selector = new ProviderSelector(providers);
        const first = selector.select({ strategy: "round-robin" });
        const second = selector.select({ strategy: "round-robin" });

        expect(first.selected).not.toBe(second.selected);
    });

});
