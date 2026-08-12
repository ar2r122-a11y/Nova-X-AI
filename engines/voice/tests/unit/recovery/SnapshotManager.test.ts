import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceSnapshotManager, VoiceSnapshot } from "../../../src/Infrastructure/Snapshots/VoiceSnapshot";

describe("SnapshotManager", () => {
    let snapshotManager: VoiceSnapshotManager;

    beforeEach(() => {
        snapshotManager = new VoiceSnapshotManager();
    });

    describe("takeSnapshot", () => {

        it("creates a snapshot from aggregate data", async () => {
            const aggregate = {
                getSnapshot: vi.fn().mockReturnValue({
                    voiceState: "active",
                    providerId: "provider-1",
                    version: 5
                })
            };

            const snapshot = await snapshotManager.takeSnapshot("voice-1", aggregate as any);
            expect(snapshot).toBeInstanceOf(VoiceSnapshot);
            expect(snapshot.getVoiceId()).toBe("voice-1");
            expect(snapshot.getVoiceState()).toBe("active");
            expect(snapshot.getProviderId()).toBe("provider-1");
            expect(snapshot.getVersion()).toBe(5);
        });

        it("sets current timestamp", async () => {
            const before = Date.now();
            const aggregate = {
                getSnapshot: vi.fn().mockReturnValue({
                    voiceState: "active",
                    providerId: "provider-1",
                    version: 1
                })
            };

            const snapshot = await snapshotManager.takeSnapshot("voice-1", aggregate as any);
            expect(snapshot.getTimestamp()).toBeGreaterThanOrEqual(before);
            expect(snapshot.getTimestamp()).toBeLessThanOrEqual(Date.now());
        });

        it("returns a snapshot with the correct voiceId", async () => {
            const aggregate = {
                getSnapshot: vi.fn().mockReturnValue({
                    voiceState: "idle",
                    providerId: "provider-2",
                    version: 0
                })
            };

            const snapshot = await snapshotManager.takeSnapshot("voice-42", aggregate as any);
            expect(snapshot.getVoiceId()).toBe("voice-42");
        });

    });

});
