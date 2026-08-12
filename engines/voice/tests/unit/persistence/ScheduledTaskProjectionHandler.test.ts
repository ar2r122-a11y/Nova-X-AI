import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScheduledTaskProjectionHandler } from "../../../src/Infrastructure/Projections/ScheduledTaskProjectionHandler";

describe("ScheduledTaskProjectionHandler", () => {
    let handler: ScheduledTaskProjectionHandler;

    beforeEach(() => {
        handler = new ScheduledTaskProjectionHandler();
    });

    it("is instantiable", () => {
        expect(handler).toBeInstanceOf(ScheduledTaskProjectionHandler);
    });

    describe("handle", () => {
        it("handles any event without throwing", async () => {
            const event = {
                eventType: "EVT_VOICE_SynthesisStarted",
                voiceId: "voice-1",
                timestamp: Date.now(),
                correlationId: "corr-1"
            };

            await expect(handler.handle(event as any)).resolves.toBeUndefined();
        });

        it("handles null-ish event payload without throwing", async () => {
            await expect(handler.handle(null as any)).resolves.toBeUndefined();
        });
    });
});
