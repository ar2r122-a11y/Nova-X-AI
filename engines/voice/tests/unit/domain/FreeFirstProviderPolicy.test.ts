import { describe, it, expect } from "vitest";
import { FreeFirstProviderPolicy } from "../../../src/Domain/Policies/FreeFirstProviderPolicy";
import { VoiceProviderId } from "../../../src/Domain/ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../../../src/Domain/ValueObjects/ProviderCostMetadata";

describe("FreeFirstProviderPolicy", () => {

    const makeCandidate = (providerId: string, costMicros: number, health: "healthy" | "degraded" | "unhealthy", supportsStreaming: boolean) => ({
        providerId: VoiceProviderId.create(providerId),
        cost: ProviderCostMetadata.create(costMicros, "USD", providerId),
        health,
        supportsStreaming
    });

    describe("selectProvider with freeOnly=true", () => {

        it("selects a healthy free provider when available", () => {
            const candidates = [
                makeCandidate("p1", 0, "healthy", true),
                makeCandidate("p2", 100, "healthy", true)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, true);
            expect(result?.providerId.getValue()).toBe("p1");
        });

        it("returns null when no free providers are available and freeOnly=true", () => {
            const candidates = [
                makeCandidate("p1", 100, "healthy", true)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, true);
            expect(result).toBeNull();
        });

    });

    describe("providerHint", () => {

        it("selects the hinted provider when it is eligible", () => {
            const candidates = [
                makeCandidate("p1", 0, "healthy", true),
                makeCandidate("p2", 0, "healthy", true)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, true, "p2");
            expect(result?.providerId.getValue()).toBe("p2");
        });

        it("ignores the hint when the hinted provider is ineligible", () => {
            const candidates = [
                makeCandidate("p1", 0, "healthy", true),
                makeCandidate("p2", 100, "healthy", true)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, true, "p2");
            expect(result?.providerId.getValue()).toBe("p1");
        });

    });

    describe("degraded health", () => {

        it("excludes unhealthy providers", () => {
            const candidates = [
                makeCandidate("p1", 0, "unhealthy", true),
                makeCandidate("p2", 0, "healthy", true)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, true);
            expect(result?.providerId.getValue()).toBe("p2");
        });

        it("still selects degraded free providers when no healthy free providers exist", () => {
            const candidates = [
                makeCandidate("p1", 0, "degraded", true)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, true);
            expect(result?.providerId.getValue()).toBe("p1");
        });

    });

    describe("no streaming support", () => {

        it("excludes providers that do not support streaming", () => {
            const candidates = [
                makeCandidate("p1", 0, "healthy", false),
                makeCandidate("p2", 0, "healthy", true)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, true);
            expect(result?.providerId.getValue()).toBe("p2");
        });

    });

    describe("fallback to paid when freeOnly=false", () => {

        it("selects a paid provider when no free providers exist and freeOnly=false", () => {
            const candidates = [
                makeCandidate("p1", 100, "healthy", true)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, false);
            expect(result?.providerId.getValue()).toBe("p1");
        });

        it("returns null when no providers are eligible at all", () => {
            const candidates = [
                makeCandidate("p1", 100, "unhealthy", false)
            ];
            const result = FreeFirstProviderPolicy.selectProvider(candidates, false);
            expect(result).toBeNull();
        });

    });

});
