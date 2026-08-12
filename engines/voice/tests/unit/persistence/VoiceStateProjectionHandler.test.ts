import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceStateProjectionHandler } from "../../../src/Infrastructure/Projections/VoiceStateProjectionHandler";

describe("VoiceStateProjectionHandler", () => {
    let handler: VoiceStateProjectionHandler;

    beforeEach(() => {
        handler = new VoiceStateProjectionHandler();
    });

    it("is instantiable", () => {
        expect(handler).toBeInstanceOf(VoiceStateProjectionHandler);
    });

    describe("handle", () => {
        it("handles VoiceInitializedEvent without throwing", async () => {
            const event = {
                eventType: "EVT_VOICE_VoiceInitialized",
                voiceId: "voice-1",
                timestamp: Date.now(),
                correlationId: "corr-1"
            };

            await expect(handler.handle(event as any)).resolves.toBeUndefined();
        });

        it("ignores unrelated events without throwing", async () => {
            const event = {
                eventType: "EVT_VOICE_SomeOtherEvent",
                timestamp: Date.now(),
                correlationId: "corr-1"
            };

            await expect(handler.handle(event as any)).resolves.toBeUndefined();
        });

        it("handles AudioChunkEvent without throwing", async () => {
            const event = {
                eventType: "EVT_VOICE_AudioChunk",
                voiceId: "voice-1",
                timestamp: Date.now(),
                correlationId: "corr-1"
            };

            await expect(handler.handle(event as any)).resolves.toBeUndefined();
        });
    });
});
