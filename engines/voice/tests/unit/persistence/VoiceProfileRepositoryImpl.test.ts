import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceProfileRepositoryImpl } from "../../../src/Infrastructure/Persistence/VoiceProfileRepositoryImpl";
import { VoiceProfile } from "../../../src/Domain/Entities/VoiceProfile";
import { VoiceProfileId } from "../../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceLocale } from "../../../src/Domain/ValueObjects/VoiceLocale";

describe("VoiceProfileRepositoryImpl", () => {
    let mockStorageEngine: any;
    let repository: VoiceProfileRepositoryImpl;

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
        repository = new VoiceProfileRepositoryImpl(mockStorageEngine);
    });

    describe("findById", () => {
        it("returns null when profile not found", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue(null);

            const result = await repository.findById(VoiceProfileId.create("profile-1"));
            expect(result).toBeNull();
        });

        it("reconstitutes VoiceProfile from stored snapshot", async () => {
            const snapshot = {
                profileId: "profile-1",
                characterId: "char-1",
                voiceId: "voice-1",
                speakingRate: 1.2,
                pitchModifier: 0.1,
                supportedParameters: ["speed", "pitch"],
                modelMetadata: { model: "v1" },
                providerCapabilityMetadata: { tts: true },
                locale: "en-US",
                configurationVersion: 2,
                createdAt: 1000,
                updatedAt: 2000
            };
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue({ id: "profile-1", data: JSON.stringify(snapshot) });

            const result = await repository.findById(VoiceProfileId.create("profile-1"));
            expect(result).toBeInstanceOf(VoiceProfile);
            expect(result!.getProfileId().getValue()).toBe("profile-1");
            expect(result!.getCharacterId()).toBe("char-1");
            expect(result!.getSpeakingRate()).toBe(1.2);
            expect(result!.getConfigurationVersion()).toBe(2);
        });
    });

    describe("findByCharacterId", () => {
        it("returns null when no profile matches characterId", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([]);

            const result = await repository.findByCharacterId("char-1");
            expect(result).toBeNull();
        });

        it("returns first profile matching characterId", async () => {
            const snapshot = {
                profileId: "profile-1", characterId: "char-1", voiceId: "voice-1",
                speakingRate: 1.0, pitchModifier: 0.0, supportedParameters: [],
                modelMetadata: {}, providerCapabilityMetadata: {}, locale: "en-US",
                configurationVersion: 1, createdAt: 1000, updatedAt: 1000
            };
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([{ id: "profile-1", data: JSON.stringify(snapshot) }]);

            const result = await repository.findByCharacterId("char-1");
            expect(result).toBeInstanceOf(VoiceProfile);
            expect(result!.getProfileId().getValue()).toBe("profile-1");
        });
    });

    describe("findAll", () => {
        it("returns all profiles", async () => {
            const snapshot = {
                profileId: "profile-1", characterId: "char-1", voiceId: "voice-1",
                speakingRate: 1.0, pitchModifier: 0.0, supportedParameters: [],
                modelMetadata: {}, providerCapabilityMetadata: {}, locale: "en-US",
                configurationVersion: 1, createdAt: 1000, updatedAt: 1000
            };
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([
                { id: "profile-1", data: JSON.stringify(snapshot) },
                { id: "profile-2", data: JSON.stringify({ ...snapshot, profileId: "profile-2" }) }
            ]);

            const result = await repository.findAll();
            expect(result).toHaveLength(2);
        });

        it("returns empty array when no profiles exist", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([]);

            const result = await repository.findAll();
            expect(result).toEqual([]);
        });
    });

    describe("save", () => {
        it("serializes and saves profile", async () => {
            const profileId = VoiceProfileId.create("profile-1");
            const locale = VoiceLocale.create("en-US");
            const profile = VoiceProfile.create(profileId, "char-1", "voice-1", locale);
            const repo = mockStorageEngine.getRepository();
            repo.save.mockResolvedValue(undefined);

            await repository.save(profile);

            expect(repo.save).toHaveBeenCalledTimes(1);
            const savedEntity = repo.save.mock.calls[0][0];
            expect(savedEntity.id).toBe("profile-1");
            const parsed = JSON.parse(savedEntity.data);
            expect(parsed.profileId).toBe("profile-1");
        });
    });

    describe("delete", () => {
        it("deletes profile by id", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.delete.mockResolvedValue(undefined);

            await repository.delete(VoiceProfileId.create("profile-1"));

            expect(repo.delete).toHaveBeenCalledWith("profile-1");
        });
    });
});
