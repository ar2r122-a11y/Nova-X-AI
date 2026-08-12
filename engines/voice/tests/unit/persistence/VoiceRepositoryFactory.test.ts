import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceRepositoryFactory } from "../../../src/Infrastructure/Persistence/VoiceRepositoryFactory";
import { VoiceRepositoryImpl } from "../../../src/Infrastructure/Persistence/VoiceRepositoryImpl";
import { VoiceSessionRepositoryImpl } from "../../../src/Infrastructure/Persistence/VoiceSessionRepositoryImpl";
import { VoiceProfileRepositoryImpl } from "../../../src/Infrastructure/Persistence/VoiceProfileRepositoryImpl";
import { VoiceEventStoreRepositoryImpl } from "../../../src/Infrastructure/Persistence/VoiceEventStoreRepositoryImpl";
import { ScheduledVoiceTaskRepositoryImpl } from "../../../src/Infrastructure/Persistence/ScheduledVoiceTaskRepositoryImpl";

describe("VoiceRepositoryFactory", () => {
    let mockStorageEngine: any;

    beforeEach(() => {
        mockStorageEngine = {
            getRepository: vi.fn().mockReturnValue({
                getById: vi.fn(),
                save: vi.fn(),
                delete: vi.fn(),
                exists: vi.fn(),
                getAll: vi.fn()
            }),
            getEventStore: vi.fn().mockReturnValue({
                appendToStream: vi.fn(),
                readStream: vi.fn(),
                getStreamVersion: vi.fn()
            })
        };
    });

    it("creates all required repositories", () => {
        const repos = VoiceRepositoryFactory.createRepositories(mockStorageEngine);

        expect(repos.voiceRepository).toBeInstanceOf(VoiceRepositoryImpl);
        expect(repos.sessionRepository).toBeInstanceOf(VoiceSessionRepositoryImpl);
        expect(repos.profileRepository).toBeInstanceOf(VoiceProfileRepositoryImpl);
        expect(repos.eventStoreRepository).toBeInstanceOf(VoiceEventStoreRepositoryImpl);
        expect(repos.scheduledTaskRepository).toBeInstanceOf(ScheduledVoiceTaskRepositoryImpl);
    });

    it("passes the same storage engine to all repositories", () => {
        const repos = VoiceRepositoryFactory.createRepositories(mockStorageEngine);

        expect(mockStorageEngine.getRepository).toHaveBeenCalledTimes(4);
        expect(mockStorageEngine.getEventStore).toHaveBeenCalledTimes(1);
    });

    it("returns an object with all five repository keys", () => {
        const repos = VoiceRepositoryFactory.createRepositories(mockStorageEngine);

        expect(repos).toHaveProperty("voiceRepository");
        expect(repos).toHaveProperty("sessionRepository");
        expect(repos).toHaveProperty("profileRepository");
        expect(repos).toHaveProperty("eventStoreRepository");
        expect(repos).toHaveProperty("scheduledTaskRepository");
    });
});
