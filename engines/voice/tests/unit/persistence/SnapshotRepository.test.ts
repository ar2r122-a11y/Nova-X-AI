import { describe, it, expect, vi, beforeEach } from "vitest";
import { SnapshotRepository } from "../../../src/Infrastructure/Snapshots/SnapshotRepository";
import { VoiceSnapshot } from "../../../src/Infrastructure/Snapshots/VoiceSnapshot";

describe("SnapshotRepository", () => {
    let mockSnapshotStore: any;
    let repository: SnapshotRepository;

    beforeEach(() => {
        mockSnapshotStore = {
            saveSnapshot: vi.fn().mockResolvedValue(undefined),
            getSnapshot: vi.fn(),
            deleteSnapshot: vi.fn().mockResolvedValue(undefined)
        };
        repository = new SnapshotRepository(mockSnapshotStore);
    });

    describe("save", () => {
        it("saves snapshot to store", async () => {
            const snapshot = new VoiceSnapshot("voice-1", "waiting_for_input", "default", 1, Date.now());

            await repository.save(snapshot);

            expect(mockSnapshotStore.saveSnapshot).toHaveBeenCalledTimes(1);
            const stored = mockSnapshotStore.saveSnapshot.mock.calls[0][0];
            expect(stored.streamId).toBe("voice-1");
            expect(stored.version).toBe(1);
            expect(stored.data.voiceId).toBe("voice-1");
        });
    });

    describe("get", () => {
        it("returns null when snapshot not found", async () => {
            mockSnapshotStore.getSnapshot.mockResolvedValue(null);

            const result = await repository.get("voice-1");

            expect(result).toBeNull();
            expect(mockSnapshotStore.getSnapshot).toHaveBeenCalledWith("voice-1");
        });

        it("reconstitutes VoiceSnapshot from stored data", async () => {
            mockSnapshotStore.getSnapshot.mockResolvedValue({
                streamId: "voice-1",
                version: 2,
                data: {
                    voiceId: "voice-1",
                    voiceState: "synthesizing",
                    providerId: "default",
                    version: 2,
                    timestamp: 1000
                },
                timestamp: 1000
            });

            const result = await repository.get("voice-1");

            expect(result).toBeInstanceOf(VoiceSnapshot);
            expect(result!.getVoiceId()).toBe("voice-1");
            expect(result!.getVoiceState()).toBe("synthesizing");
            expect(result!.getVersion()).toBe(2);
        });
    });

    describe("delete", () => {
        it("deletes snapshot by voiceId", async () => {
            await repository.delete("voice-1");

            expect(mockSnapshotStore.deleteSnapshot).toHaveBeenCalledWith("voice-1");
        });
    });
});
