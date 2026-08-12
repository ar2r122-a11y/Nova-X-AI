import { describe, it, expect } from "vitest";
import { VoiceProfileDto } from "../../../src/Application/DTO/VoiceProfileDto";

describe("VoiceProfileDto", () => {
    it("creates with all properties", () => {
        const dto = new VoiceProfileDto(
            "profile-1",
            "char-1",
            "voice-1",
            1.0,
            0.0,
            ["stability"],
            {},
            {},
            "en-US",
            1,
            1700000000000,
            1700000001000
        );
        expect(dto.profileId).toBe("profile-1");
        expect(dto.characterId).toBe("char-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.speakingRate).toBe(1.0);
        expect(dto.pitchModifier).toBe(0.0);
        expect(dto.supportedParameters).toEqual(["stability"]);
        expect(dto.modelMetadata).toEqual({});
        expect(dto.providerCapabilityMetadata).toEqual({});
        expect(dto.locale).toBe("en-US");
        expect(dto.configurationVersion).toBe(1);
        expect(dto.createdAt).toBe(1700000000000);
        expect(dto.updatedAt).toBe(1700000001000);
    });

    it("creates from profile object", () => {
        const profile = {
            getProfileId: () => ({ getValue: () => "profile-1" }),
            getCharacterId: () => "char-1",
            getVoiceId: () => "voice-1",
            getSpeakingRate: () => 1.2,
            getPitchModifier: () => 0.5,
            getSupportedParameters: () => ["stability", "similarity"],
            getModelMetadata: () => ({ version: "v2" }),
            getProviderCapabilityMetadata: () => ({ provider: "openai" }),
            getLocale: () => ({ getValue: () => "en-US" }),
            getConfigurationVersion: () => 2,
            getCreatedAt: () => 1700000000000,
            getUpdatedAt: () => 1700000001000
        };
        const dto = VoiceProfileDto.fromProfile(profile as any);
        expect(dto.profileId).toBe("profile-1");
        expect(dto.characterId).toBe("char-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.speakingRate).toBe(1.2);
        expect(dto.pitchModifier).toBe(0.5);
        expect(dto.supportedParameters).toEqual(["stability", "similarity"]);
        expect(dto.modelMetadata).toEqual({ version: "v2" });
        expect(dto.providerCapabilityMetadata).toEqual({ provider: "openai" });
        expect(dto.locale).toBe("en-US");
        expect(dto.configurationVersion).toBe(2);
        expect(dto.createdAt).toBe(1700000000000);
        expect(dto.updatedAt).toBe(1700000001000);
    });

    it("fromProfile converts readonly parameters to array", () => {
        const profile = {
            getProfileId: () => ({ getValue: () => "profile-1" }),
            getCharacterId: () => "char-1",
            getVoiceId: () => "voice-1",
            getSpeakingRate: () => 1.0,
            getPitchModifier: () => 0.0,
            getSupportedParameters: () => Object.freeze(["stability"]),
            getModelMetadata: () => ({}),
            getProviderCapabilityMetadata: () => ({}),
            getLocale: () => ({ getValue: () => "en-US" }),
            getConfigurationVersion: () => 1,
            getCreatedAt: () => 1700000000000,
            getUpdatedAt: () => 1700000001000
        };
        const dto = VoiceProfileDto.fromProfile(profile as any);
        expect(dto.supportedParameters).toEqual(["stability"]);
        expect(Array.isArray(dto.supportedParameters)).toBe(true);
    });

    it("fromProfile returns a new instance each call", () => {
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
        const dto1 = VoiceProfileDto.fromProfile(profile as any);
        const dto2 = VoiceProfileDto.fromProfile(profile as any);
        expect(dto1).not.toBe(dto2);
        expect(dto1.profileId).toBe(dto2.profileId);
    });
});
