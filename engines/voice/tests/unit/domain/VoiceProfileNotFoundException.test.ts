import { describe, it, expect } from "vitest";
import { VoiceProfileNotFoundException } from "../../../src/Domain/Exceptions/index";

describe("VoiceProfileNotFoundException", () => {

    it("creates an exception with the correct message", () => {
        const ex = new VoiceProfileNotFoundException("profile-1");
        expect(ex.message).toBe("Voice profile not found: profile-1");
        expect(ex.name).toBe("VoiceProfileNotFoundException");
    });

    it("is an instance of Error", () => {
        const ex = new VoiceProfileNotFoundException("profile-1");
        expect(ex).toBeInstanceOf(Error);
    });

});
