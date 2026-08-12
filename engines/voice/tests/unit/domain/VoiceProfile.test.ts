import { describe, it, expect } from "vitest";
import { VoiceProfile } from "../../../src/Domain/Entities/VoiceProfile";
import { VoiceProfileId } from "../../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceLocale } from "../../../src/Domain/ValueObjects/VoiceLocale";

describe("VoiceProfile", () => {

    describe("create", () => {

        it("creates a new voice profile with default values", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(profile.getProfileId().getValue()).toBe("profile-1");
            expect(profile.getCharacterId()).toBe("char-1");
            expect(profile.getVoiceId()).toBe("voice-1");
            expect(profile.getSpeakingRate()).toBe(1.0);
            expect(profile.getPitchModifier()).toBe(0.0);
            expect(profile.getConfigurationVersion()).toBe(1);
            expect(profile.getLocale().getValue()).toBe("en-US");
        });

    });

    describe("getters", () => {

        it("returns supported parameters", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(profile.getSupportedParameters()).toEqual(["speed", "pitch"]);
        });

        it("returns empty model metadata by default", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(profile.getModelMetadata()).toEqual({});
        });

        it("returns empty provider capability metadata by default", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(profile.getProviderCapabilityMetadata()).toEqual({});
        });

        it("returns created and updated timestamps", () => {
            const before = Date.now();
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            const after = Date.now();
            expect(profile.getCreatedAt()).toBeGreaterThanOrEqual(before);
            expect(profile.getCreatedAt()).toBeLessThanOrEqual(after);
            expect(profile.getUpdatedAt()).toBeGreaterThanOrEqual(before);
            expect(profile.getUpdatedAt()).toBeLessThanOrEqual(after);
        });

    });

    describe("updateSpeakingRate", () => {

        it("updates the speaking rate", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            profile.updateSpeakingRate(1.5);
            expect(profile.getSpeakingRate()).toBe(1.5);
        });

        it("increments the configuration version", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(profile.getConfigurationVersion()).toBe(1);
            profile.updateSpeakingRate(1.5);
            expect(profile.getConfigurationVersion()).toBe(2);
        });

        it("updates the updatedAt timestamp", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            const before = Date.now();
            profile.updateSpeakingRate(1.5);
            expect(profile.getUpdatedAt()).toBeGreaterThanOrEqual(before);
        });

        it("throws when speaking rate is below 0.5", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(() => profile.updateSpeakingRate(0.4)).toThrow("Speaking rate must be between 0.5 and 2.0.");
        });

        it("throws when speaking rate is above 2.0", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(() => profile.updateSpeakingRate(2.1)).toThrow("Speaking rate must be between 0.5 and 2.0.");
        });

    });

    describe("updatePitchModifier", () => {

        it("updates the pitch modifier", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            profile.updatePitchModifier(0.5);
            expect(profile.getPitchModifier()).toBe(0.5);
        });

        it("increments the configuration version", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(profile.getConfigurationVersion()).toBe(1);
            profile.updatePitchModifier(0.5);
            expect(profile.getConfigurationVersion()).toBe(2);
        });

        it("throws when pitch modifier is below -1.0", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(() => profile.updatePitchModifier(-1.1)).toThrow("Pitch modifier must be between -1.0 and 1.0.");
        });

        it("throws when pitch modifier is above 1.0", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(() => profile.updatePitchModifier(1.1)).toThrow("Pitch modifier must be between -1.0 and 1.0.");
        });

    });

});
