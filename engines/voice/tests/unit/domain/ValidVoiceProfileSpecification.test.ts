import { describe, it, expect } from "vitest";
import { ValidVoiceProfileSpecification } from "../../../src/Domain/Specifications/index";
import { VoiceProfile } from "../../../src/Domain/Entities/VoiceProfile";
import { VoiceProfileId } from "../../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceLocale } from "../../../src/Domain/ValueObjects/VoiceLocale";

describe("ValidVoiceProfileSpecification", () => {

    describe("isSatisfiedBy", () => {

        it("returns false for a null profile", () => {
            expect(ValidVoiceProfileSpecification.isSatisfiedBy(null)).toBe(false);
        });

        it("returns true for a valid profile", () => {
            const profile = VoiceProfile.create(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                VoiceLocale.create("en-US")
            );
            expect(ValidVoiceProfileSpecification.isSatisfiedBy(profile)).toBe(true);
        });

        it("returns false when configurationVersion is 0", () => {
            const profile = VoiceProfile.reconstitute(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "voice-1",
                1.0,
                0.0,
                ["speed"],
                {},
                {},
                VoiceLocale.create("en-US"),
                0,
                Date.now(),
                Date.now()
            );
            expect(ValidVoiceProfileSpecification.isSatisfiedBy(profile)).toBe(false);
        });

        it("returns false when voiceId is empty", () => {
            const profile = VoiceProfile.reconstitute(
                VoiceProfileId.create("profile-1"),
                "char-1",
                "",
                1.0,
                0.0,
                ["speed"],
                {},
                {},
                VoiceLocale.create("en-US"),
                1,
                Date.now(),
                Date.now()
            );
            expect(ValidVoiceProfileSpecification.isSatisfiedBy(profile)).toBe(false);
        });

    });

});
