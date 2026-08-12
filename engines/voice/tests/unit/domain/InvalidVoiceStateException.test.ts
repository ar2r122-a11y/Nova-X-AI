import { describe, it, expect } from "vitest";
import { InvalidVoiceStateException } from "../../../src/Domain/Exceptions/index";

describe("InvalidVoiceStateException", () => {

    it("creates an exception with the correct message", () => {
        const ex = new InvalidVoiceStateException("waiting_for_input", "synthesizing");
        expect(ex.message).toBe("Invalid voice state transition: waiting_for_input -> synthesizing");
        expect(ex.name).toBe("InvalidVoiceStateException");
    });

    it("is an instance of Error", () => {
        const ex = new InvalidVoiceStateException("idle", "active");
        expect(ex).toBeInstanceOf(Error);
    });

});
