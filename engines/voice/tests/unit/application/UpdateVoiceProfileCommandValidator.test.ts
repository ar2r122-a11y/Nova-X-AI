import { describe, it, expect } from "vitest";
import { UpdateVoiceProfileCommandValidator } from "../../../src/Application/Validators/UpdateVoiceProfileCommandValidator";
import { UpdateVoiceProfileCommand } from "../../../src/Application/Commands/UpdateVoiceProfileCommand";

describe("UpdateVoiceProfileCommandValidator", () => {
    const validator = new UpdateVoiceProfileCommandValidator();

    it("does not throw for valid command with no optional fields", () => {
        const command = new UpdateVoiceProfileCommand("profile-1");
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("throws when profileId is empty", () => {
        const command = new UpdateVoiceProfileCommand("");
        expect(() => validator.validate(command)).toThrow("ProfileId is required.");
    });

    it("throws when profileId is whitespace", () => {
        const command = new UpdateVoiceProfileCommand("  ");
        expect(() => validator.validate(command)).toThrow("ProfileId is required.");
    });

    it("does not throw when speakingRate is 0.5", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", 0.5);
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("does not throw when speakingRate is 2.0", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", 2.0);
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("throws when speakingRate is below 0.5", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", 0.4);
        expect(() => validator.validate(command)).toThrow("SpeakingRate must be between 0.5 and 2.0.");
    });

    it("throws when speakingRate is above 2.0", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", 2.1);
        expect(() => validator.validate(command)).toThrow("SpeakingRate must be between 0.5 and 2.0.");
    });

    it("does not throw when pitchModifier is -1.0", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, -1.0);
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("does not throw when pitchModifier is 1.0", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, 1.0);
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("throws when pitchModifier is below -1.0", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, -1.1);
        expect(() => validator.validate(command)).toThrow("PitchModifier must be between -1.0 and 1.0.");
    });

    it("throws when pitchModifier is above 1.0", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, 1.1);
        expect(() => validator.validate(command)).toThrow("PitchModifier must be between -1.0 and 1.0.");
    });
});
