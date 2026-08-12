import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListVoiceProfilesQueryHandler } from "../../../src/Application/Handlers/ListVoiceProfilesQueryHandler";
import { ListVoiceProfilesQuery } from "../../../src/Application/Queries/ListVoiceProfilesQuery";
import { VoiceProfileSummaryDto } from "../../../src/Application/DTO/VoiceProfileSummaryDto";
import { VoiceProfile } from "../../../src/Domain/Entities/VoiceProfile";
import { VoiceProfileId } from "../../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceLocale } from "../../../src/Domain/ValueObjects/VoiceLocale";

describe("ListVoiceProfilesQueryHandler", () => {
    let mockProfileRepository: any;
    let handler: ListVoiceProfilesQueryHandler;

    beforeEach(() => {
        mockProfileRepository = {};
        handler = new ListVoiceProfilesQueryHandler(mockProfileRepository);
    });

    it("returns empty array when no profiles found", async () => {
        mockProfileRepository.findAll = vi.fn().mockResolvedValue([]);
        const query = new ListVoiceProfilesQuery();
        const result = await handler.handle(query);
        expect(result).toEqual([]);
        expect(mockProfileRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("returns profiles array when profiles found", async () => {
        const profile1 = {
            getProfileId: () => ({ getValue: () => "profile-1" }),
            getCharacterId: () => "char-1",
            getVoiceId: () => "voice-1",
            getLocale: () => ({ getValue: () => "en-US" }),
            getSpeakingRate: () => 1.0,
            getConfigurationVersion: () => 1
        };
        const profile2 = {
            getProfileId: () => ({ getValue: () => "profile-2" }),
            getCharacterId: () => "char-2",
            getVoiceId: () => "voice-2",
            getLocale: () => ({ getValue: () => "fr-FR" }),
            getSpeakingRate: () => 1.2,
            getConfigurationVersion: () => 2
        };
        mockProfileRepository.findAll = vi.fn().mockResolvedValue([profile1, profile2]);
        const query = new ListVoiceProfilesQuery();
        const result = await handler.handle(query);
        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(VoiceProfileSummaryDto);
        expect(result[0].profileId).toBe("profile-1");
        expect(result[1].profileId).toBe("profile-2");
        expect(mockProfileRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("filters by characterId when provided", async () => {
        const profile = VoiceProfile.create(
            VoiceProfileId.create("profile-1"),
            "char-1",
            "voice-1",
            VoiceLocale.englishUS()
        );
        mockProfileRepository.findByCharacterId = vi.fn().mockResolvedValue(profile);
        const query = new ListVoiceProfilesQuery("char-1");
        const result = await handler.handle(query);
        expect(result).toHaveLength(1);
        expect(result[0].profileId).toBe("profile-1");
        expect(mockProfileRepository.findByCharacterId).toHaveBeenCalledWith("char-1");
    });

    it("returns empty array when findByCharacterId returns non-VoiceProfile", async () => {
        mockProfileRepository.findByCharacterId = vi.fn().mockResolvedValue(null);
        const query = new ListVoiceProfilesQuery("char-1");
        const result = await handler.handle(query);
        expect(result).toEqual([]);
        expect(mockProfileRepository.findByCharacterId).toHaveBeenCalledTimes(1);
    });
});
