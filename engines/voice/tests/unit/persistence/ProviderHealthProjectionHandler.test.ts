import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProviderHealthProjectionHandler } from "../../../src/Infrastructure/Projections/ProviderHealthProjectionHandler";

describe("ProviderHealthProjectionHandler", () => {
    let handler: ProviderHealthProjectionHandler;

    beforeEach(() => {
        handler = new ProviderHealthProjectionHandler();
    });

    it("is instantiable", () => {
        expect(handler).toBeInstanceOf(ProviderHealthProjectionHandler);
    });

    describe("handle", () => {
        it("handles ProviderStatusChangedEvent without throwing", async () => {
            const event = {
                eventType: "EVT_VOICE_ProviderStatusChanged",
                providerId: "provider-1",
                previousStatus: "healthy",
                newStatus: "degraded",
                timestamp: Date.now(),
                correlationId: "corr-1"
            };

            await expect(handler.handle(event as any)).resolves.toBeUndefined();
        });

        it("ignores unrelated events without throwing", async () => {
            const event = {
                eventType: "EVT_VOICE_VoiceInitialized",
                voiceId: "voice-1",
                timestamp: Date.now(),
                correlationId: "corr-1"
            };

            await expect(handler.handle(event as any)).resolves.toBeUndefined();
        });
    });
});
