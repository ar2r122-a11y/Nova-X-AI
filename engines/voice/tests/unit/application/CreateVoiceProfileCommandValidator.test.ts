import { describe, it, expect } from "vitest";
import { CreateVoiceProfileCommandValidator } from "../../../src/Application/Validators/CreateVoiceProfileCommandValidator";
import { CreateVoiceProfileCommand } from "../../../src/Application/Commands/CreateVoiceProfileCommand";

describe("CreateVoiceProfileCommandValidator", () => {
    const validator = new CreateVoiceProfileCommandValidator();

    it("does not throw for valid command", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US");
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("throws when characterId is empty", () => {
        const command = new CreateVoiceProfileCommand("", "voice-1", "en-US");
        expect(() => validator.validate(command)).toThrow("CharacterId is required.");
    });

    it("throws when voiceId is empty", () => {
        const command = new CreateVoiceProfileCommand("char-1", "", "en-US");
        expect(() => validator.validate(command)).toThrow("VoiceId is required.");
    });

    it("throws when locale is empty", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "");
        expect(() => validator.validate(command)).toThrow("Locale is required.");
    });

    it("throws when locale is whitespace", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "  ");
        expect(() => validator.validate(command)).toThrow("Locale is required.");
    });
});
