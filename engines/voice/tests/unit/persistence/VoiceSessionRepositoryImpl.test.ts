import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceSessionRepositoryImpl } from "../../../src/Infrastructure/Persistence/VoiceSessionRepositoryImpl";
import { VoiceSessionAggregate } from "../../../src/Domain/Aggregates/VoiceSessionAggregate";
import { VoiceSessionId } from "../../../src/Domain/ValueObjects/VoiceSessionId";
import { VoiceId } from "../../../src/Domain/ValueObjects/VoiceId";
import { VoiceProfileId } from "../../../src/Domain/ValueObjects/VoiceProfileId";

describe("VoiceSessionRepositoryImpl", () => {
    let mockStorageEngine: any;
    let repository: VoiceSessionRepositoryImpl;

    beforeEach(() => {
        mockStorageEngine = {
            getRepository: vi.fn().mockReturnValue({
                getById: vi.fn(),
                save: vi.fn(),
                delete: vi.fn(),
                exists: vi.fn(),
                getAll: vi.fn()
            })
        };
        repository = new VoiceSessionRepositoryImpl(mockStorageEngine);
    });

    describe("findById", () => {
        it("returns null when session not found", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue(null);

            const result = await repository.findById(VoiceSessionId.create("session-1"));
            expect(result).toBeNull();
            expect(repo.getById).toHaveBeenCalledWith("session-1");
        });

        it("reconstitutes VoiceSessionAggregate from stored snapshot", async () => {
            const snapshot = {
                sessionId: "session-1",
                voiceId: "voice-1",
                profileId: "profile-1",
                sessionState: "active",
                version: 1,
                startedAt: 1000,
                endedAt: null,
                totalAudioDurationMs: 500,
                text: "hello"
            };
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue({ id: "session-1", data: JSON.stringify(snapshot) });

            const result = await repository.findById(VoiceSessionId.create("session-1"));
            expect(result).toBeInstanceOf(VoiceSessionAggregate);
            expect(result!.getSessionId().getValue()).toBe("session-1");
            expect(result!.getVoiceId().getValue()).toBe("voice-1");
            expect(result!.getProfileId().getValue()).toBe("profile-1");
            expect(result!.getSessionState().getValue()).toBe("active");
            expect(result!.getTotalAudioDurationMs()).toBe(500);
            expect(result!.getText()).toBe("hello");
        });
    });

    describe("findByVoiceId", () => {
        it("returns empty array when no sessions match", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([]);

            const result = await repository.findByVoiceId("voice-1");
            expect(result).toEqual([]);
        });

        it("filters and reconstitutes sessions by voiceId", async () => {
            const session1 = {
                sessionId: "session-1", voiceId: "voice-1", profileId: "profile-1",
                sessionState: "active", version: 1, startedAt: 1000, endedAt: null,
                totalAudioDurationMs: 500, text: "hello"
            };
            const session2 = {
                sessionId: "session-2", voiceId: "voice-2", profileId: "profile-2",
                sessionState: "active", version: 1, startedAt: 2000, endedAt: null,
                totalAudioDurationMs: 300, text: "world"
            };
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([
                { id: "session-1", data: JSON.stringify(session1) },
                { id: "session-2", data: JSON.stringify(session2) }
            ]);

            const result = await repository.findByVoiceId("voice-1");
            expect(result).toHaveLength(1);
            expect(result[0].getSessionId().getValue()).toBe("session-1");
        });
    });

    describe("save", () => {
        it("serializes and saves session aggregate", async () => {
            const sessionId = VoiceSessionId.create("session-1");
            const voiceId = VoiceId.create("voice-1");
            const profileId = VoiceProfileId.create("profile-1");
            const aggregate = VoiceSessionAggregate.create(sessionId, voiceId, profileId, "hello");
            const repo = mockStorageEngine.getRepository();
            repo.save.mockResolvedValue(undefined);

            await repository.save(aggregate);

            expect(repo.save).toHaveBeenCalledTimes(1);
            const savedEntity = repo.save.mock.calls[0][0];
            expect(savedEntity.id).toBe("session-1");
            const parsed = JSON.parse(savedEntity.data);
            expect(parsed.sessionId).toBe("session-1");
        });
    });
});
