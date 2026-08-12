import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceRepositoryImpl } from "../../src/Infrastructure/Persistence/VoiceRepositoryImpl";
import { VoiceSessionRepositoryImpl } from "../../src/Infrastructure/Persistence/VoiceSessionRepositoryImpl";
import { VoiceProfileRepositoryImpl } from "../../src/Infrastructure/Persistence/VoiceProfileRepositoryImpl";
import { VoiceEventStoreRepositoryImpl } from "../../src/Infrastructure/Persistence/VoiceEventStoreRepositoryImpl";
import { ScheduledVoiceTaskRepositoryImpl } from "../../src/Infrastructure/Persistence/ScheduledVoiceTaskRepositoryImpl";
import { VoiceAggregate } from "../../src/Domain/Aggregates/VoiceAggregate";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";
import { VoiceProviderId } from "../../src/Domain/ValueObjects/VoiceProviderId";
import { VoiceSessionAggregate } from "../../src/Domain/Aggregates/VoiceSessionAggregate";
import { VoiceSessionId } from "../../src/Domain/ValueObjects/VoiceSessionId";
import { VoiceProfileId } from "../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceProfile } from "../../src/Domain/Entities/VoiceProfile";
import { VoiceLocale } from "../../src/Domain/ValueObjects/VoiceLocale";
import { ScheduledVoiceTaskEntity } from "../../src/Domain/Entities/ScheduledVoiceTaskEntity";

describe("StorageIntegration", () => {
    let mockStorageEngine: any;

    beforeEach(() => {
        const inMemoryRepo = () => {
            const store = new Map<string, any>();
            return {
                getById: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
                save: vi.fn((entity: any) => Promise.resolve(store.set(entity.id, entity))),
                delete: vi.fn((key: string) => Promise.resolve(store.delete(key))),
                exists: vi.fn((key: string) => Promise.resolve(store.has(key))),
                getAll: vi.fn(() => Promise.resolve(Array.from(store.values())))
            };
        };

        const eventStore = {
            appendToStream: vi.fn().mockResolvedValue(undefined),
            readStream: vi.fn().mockResolvedValue([]),
            getStreamVersion: vi.fn().mockResolvedValue(0)
        };

        mockStorageEngine = {
            getRepository: vi.fn((name: string) => {
                const repo = inMemoryRepo();
                return repo;
            }),
            getEventStore: vi.fn(() => eventStore)
        };
    });

    describe("VoiceRepositoryImpl integration", () => {
        it("persists and retrieves VoiceAggregate", async () => {
            const repo = new VoiceRepositoryImpl(mockStorageEngine);
            const aggregate = VoiceAggregate.create(VoiceId.create("voice-1"), VoiceProviderId.create("default"));

            await repo.save(aggregate);
            const retrieved = await repo.findById(VoiceId.create("voice-1"));

            expect(retrieved).toBeInstanceOf(VoiceAggregate);
            expect(retrieved!.getVoiceId().getValue()).toBe("voice-1");
            expect(retrieved!.getVoiceState().getValue()).toBe("waiting_for_input");
        });
    });

    describe("VoiceSessionRepositoryImpl integration", () => {
        it("persists and retrieves VoiceSessionAggregate", async () => {
            const repo = new VoiceSessionRepositoryImpl(mockStorageEngine);
            const aggregate = VoiceSessionAggregate.create(
                VoiceSessionId.create("session-1"),
                VoiceId.create("voice-1"),
                VoiceProfileId.create("profile-1"),
                "hello"
            );

            await repo.save(aggregate);
            const retrieved = await repo.findById(VoiceSessionId.create("session-1"));

            expect(retrieved).toBeInstanceOf(VoiceSessionAggregate);
            expect(retrieved!.getSessionId().getValue()).toBe("session-1");
            expect(retrieved!.getText()).toBe("hello");
        });
    });

    describe("VoiceProfileRepositoryImpl integration", () => {
        it("persists and retrieves VoiceProfile", async () => {
            const repo = new VoiceProfileRepositoryImpl(mockStorageEngine);
            const profile = VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US"));

            await repo.save(profile);
            const retrieved = await repo.findById(VoiceProfileId.create("profile-1"));

            expect(retrieved).toBeInstanceOf(VoiceProfile);
            expect(retrieved!.getProfileId().getValue()).toBe("profile-1");
        });

        it("supports findByCharacterId", async () => {
            const repo = new VoiceProfileRepositoryImpl(mockStorageEngine);
            const profile = VoiceProfile.create(VoiceProfileId.create("profile-1"), "char-1", "voice-1", VoiceLocale.create("en-US"));
            await repo.save(profile);

            const retrieved = await repo.findByCharacterId("char-1");
            expect(retrieved).toBeInstanceOf(VoiceProfile);
            expect(retrieved!.getCharacterId()).toBe("char-1");
        });
    });

    describe("ScheduledVoiceTaskRepositoryImpl integration", () => {
        it("persists and retrieves ScheduledVoiceTaskEntity", async () => {
            const repo = new ScheduledVoiceTaskRepositoryImpl(mockStorageEngine);
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "hello", "profile-1", Date.now(), 1, 3);

            await repo.save(task);
            const retrieved = await repo.findById("task-1");

            expect(retrieved).toBeInstanceOf(ScheduledVoiceTaskEntity);
            expect(retrieved!.getTaskId()).toBe("task-1");
        });

        it("supports findByVoiceId", async () => {
            const repo = new ScheduledVoiceTaskRepositoryImpl(mockStorageEngine);
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "hello", "profile-1", Date.now(), 1, 3);
            await repo.save(task);

            const results = await repo.findByVoiceId("voice-1");
            expect(results).toHaveLength(1);
            expect(results[0].getTaskId()).toBe("task-1");
        });
    });

    describe("VoiceEventStoreRepositoryImpl integration", () => {
        it("appends and reads events", async () => {
            const repo = new VoiceEventStoreRepositoryImpl(mockStorageEngine);
            await repo.appendToStream("stream-1", [{ type: "test" }], 0);
            const events = await repo.readStream("stream-1", 0);

            expect(mockStorageEngine.getEventStore().appendToStream).toHaveBeenCalledWith("stream-1", [{ type: "test" }], 0);
            expect(mockStorageEngine.getEventStore().readStream).toHaveBeenCalledWith("stream-1", 0);
        });

        it("returns stream version", async () => {
            const repo = new VoiceEventStoreRepositoryImpl(mockStorageEngine);
            const version = await repo.getStreamVersion("stream-1");

            expect(version).toBe(0);
        });
    });
});
