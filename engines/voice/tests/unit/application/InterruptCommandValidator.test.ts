import { describe, it, expect } from "vitest";
import { InterruptCommandValidator } from "../../../src/Application/Validators/InterruptCommandValidator";
import { InterruptCommand } from "../../../src/Application/Commands/InterruptCommand";

describe("InterruptCommandValidator", () => {
    const validator = new InterruptCommandValidator();

    it("does not throw for valid command", () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request");
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("throws when voiceId is empty", () => {
        const command = new InterruptCommand("", "req-1", "user request");
        expect(() => validator.validate(command)).toThrow("VoiceId is required.");
    });

    it("throws when requestId is empty", () => {
        const command = new InterruptCommand("voice-1", "", "user request");
        expect(() => validator.validate(command)).toThrow("RequestId is required.");
    });

    it("throws when reason is empty", () => {
        const command = new InterruptCommand("voice-1", "req-1", "");
        expect(() => validator.validate(command)).toThrow("Reason is required.");
    });

    it("throws when reason is whitespace", () => {
        const command = new InterruptCommand("voice-1", "req-1", "   ");
        expect(() => validator.validate(command)).toThrow("Reason is required.");
    });
});
