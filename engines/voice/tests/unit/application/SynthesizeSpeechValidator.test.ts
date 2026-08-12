import { describe, it, expect } from "vitest";
import { SynthesizeSpeechValidator } from "../../../src/Application/Validators/SynthesizeSpeechValidator";
import { SynthesizeSpeechCommand } from "../../../src/Application/Commands/SynthesizeSpeechCommand";

describe("SynthesizeSpeechValidator", () => {
    const validator = new SynthesizeSpeechValidator();

    it("does not throw for valid command", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello world", "profile-1");
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("throws when voiceId is empty", () => {
        const command = new SynthesizeSpeechCommand("", "Hello", "profile-1");
        expect(() => validator.validate(command)).toThrow("VoiceId is required.");
    });

    it("throws when voiceId is whitespace", () => {
        const command = new SynthesizeSpeechCommand("   ", "Hello", "profile-1");
        expect(() => validator.validate(command)).toThrow("VoiceId is required.");
    });

    it("throws when text is empty", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "", "profile-1");
        expect(() => validator.validate(command)).toThrow("Text is required.");
    });

    it("throws when text is whitespace", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "   ", "profile-1");
        expect(() => validator.validate(command)).toThrow("Text is required.");
    });

    it("throws when text exceeds 2048 characters", () => {
        const longText = "a".repeat(2049);
        const command = new SynthesizeSpeechCommand("voice-1", longText, "profile-1");
        expect(() => validator.validate(command)).toThrow("Text exceeds maximum length of 2048 characters.");
    });

    it("does not throw when text is exactly 2048 characters", () => {
        const text = "a".repeat(2048);
        const command = new SynthesizeSpeechCommand("voice-1", text, "profile-1");
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("throws when voiceProfileId is empty", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "");
        expect(() => validator.validate(command)).toThrow("VoiceProfileId is required.");
    });

    it("throws when voiceProfileId is whitespace", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "  ");
        expect(() => validator.validate(command)).toThrow("VoiceProfileId is required.");
    });

    it("accepts optional providerId", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1", "provider-1");
        expect(() => validator.validate(command)).not.toThrow();
    });
});
