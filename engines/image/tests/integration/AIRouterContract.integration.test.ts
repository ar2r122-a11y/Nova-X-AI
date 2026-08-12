import { describe, it, expect } from "vitest";
import { ProviderFailoverPolicy } from "../../src/Domain/Policies/ProviderFailoverPolicy";
import { FakeImageProviderAdapter } from "../../src/Infrastructure/Adapters/FakeImageProviderAdapter";
import { ProviderSelectionService } from "../../src/Domain/Services/ImageEngineServices";

describe("AIRouterContract.integration", () => {
    it("should route generation to correct provider", async () => {
        const provider = new FakeImageProviderAdapter();
        const result = await provider.executeGeneration({
            imageId: "img-1",
            prompt: "test",
            negativePrompt: "",
            mode: "textToImage",
            width: 1024,
            height: 1024,
            candidateCount: 1,
            seed: 123,
            steps: 20,
            cfgScale: 7.0,
            visualTags: [],
            styleTokens: [],
            environmentalModifiers: []
        });
        expect(result.success).toBe(true);
        expect(result.providerId).toBe("fake-provider");
    });

    it("should failover on provider failure", async () => {
        const policy = new ProviderFailoverPolicy(["p1", "p2"], 3);
        expect(policy.getNextProvider("p1")).toBe("p2");
        expect(policy.shouldFailover(0)).toBe(true);
        expect(policy.shouldFailover(2)).toBe(true);
        expect(policy.shouldFailover(3)).toBe(false);
    });

    it("should select and rotate providers", () => {
        const selection = new ProviderSelectionService(["p1", "p2", "p3"]);
        expect(selection.select(false)).toBe("p1");
        selection.select(true);
        expect(selection.getCurrentProvider()).toBe("p2");
        selection.select(true);
        expect(selection.getCurrentProvider()).toBe("p3");
    });

    it("should throw for unknown provider", () => {
        const policy = new ProviderFailoverPolicy(["p1"]);
        expect(() => policy.getNextProvider("unknown")).toThrow();
    });

    it("should not failover with single provider", () => {
        const policy = new ProviderFailoverPolicy(["p1"], 3);
        expect(policy.shouldFailover(0)).toBe(false);
    });
});
