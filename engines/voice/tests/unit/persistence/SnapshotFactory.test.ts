import { describe, it, expect, vi, beforeEach } from "vitest";
import { SnapshotFactory } from "../../../src/Infrastructure/Snapshots/SnapshotFactory";
import { VoiceSnapshot } from "../../../src/Infrastructure/Snapshots/VoiceSnapshot";

describe("SnapshotFactory", () => {
    it("creates VoiceSnapshot from aggregate snapshot", () => {
        const aggregate = {
            getSnapshot: () => ({
                voiceState: "synthesizing",
                providerId: "default",
                version: 3
            })
        };

        const before = Date.now();
        const snapshot = SnapshotFactory.createVoiceSnapshot("voice-1", aggregate as any);
        const after = Date.now();

        expect(snapshot).toBeInstanceOf(VoiceSnapshot);
        expect(snapshot.getVoiceId()).toBe("voice-1");
        expect(snapshot.getVoiceState()).toBe("synthesizing");
        expect(snapshot.getProviderId()).toBe("default");
        expect(snapshot.getVersion()).toBe(3);
        expect(snapshot.getTimestamp()).toBeGreaterThanOrEqual(before);
        expect(snapshot.getTimestamp()).toBeLessThanOrEqual(after);
    });

    it("creates snapshot with waiting_for_input state", () => {
        const aggregate = {
            getSnapshot: () => ({
                voiceState: "waiting_for_input",
                providerId: "provider-1",
                version: 0
            })
        };

        const snapshot = SnapshotFactory.createVoiceSnapshot("voice-2", aggregate as any);

        expect(snapshot.getVoiceState()).toBe("waiting_for_input");
        expect(snapshot.getProviderId()).toBe("provider-1");
    });
});
