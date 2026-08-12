import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetVoiceProfileQueryHandler } from "../../../src/Application/Handlers/GetVoiceProfileQueryHandler";
import { GetVoiceProfileQuery } from "../../../src/Application/Queries/GetVoiceProfileQuery";
import { VoiceProfileDto } from "../../../src/Application/DTO/VoiceProfileDto";

describe("GetVoiceProfileQueryHandler", () => {
    let mockProfileRepository: any;
    let handler: GetVoiceProfileQueryHandler;

    beforeEach(() => {
        mockProfileRepository = {};
        handler = new GetVoiceProfileQueryHandler(mockProfileRepository);
    });

    it("throws when profile not found", async () => {
        mockProfileRepository.findById = vi.fn().mockResolvedValue(null);
        const query = new GetVoiceProfileQuery("profile-1", "user-1");
        await expect(handler.handle(query)).rejects.toThrow("Voice profile not found: profile-1");
        expect(mockProfileRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("returns VoiceProfileDto when profile found", async () => {
        const profile = {
            getProfileId: () => ({ getValue: () => "profile-1" }),
            getCharacterId: () => "char-1",
            getVoiceId: () => "voice-1",
            getSpeakingRate: () => 1.0,
            getPitchModifier: () => 0.0,
            getSupportedParameters: () => ["stability"],
            getModelMetadata: () => ({}),
            getProviderCapabilityMetadata: () => ({}),
            getLocale: () => ({ getValue: () => "en-US" }),
            getConfigurationVersion: () => 1,
            getCreatedAt: () => 1700000000000,
            getUpdatedAt: () => 1700000001000
        };
        mockProfileRepository.findById = vi.fn().mockResolvedValue(profile);
        const query = new GetVoiceProfileQuery("profile-1", "user-1");
        const result = await handler.handle(query);
        expect(result).toBeInstanceOf(VoiceProfileDto);
        expect(result.profileId).toBe("profile-1");
        expect(result.characterId).toBe("char-1");
        expect(mockProfileRepository.findById).toHaveBeenCalledTimes(1);
    });
});
