import { describe, it, expect } from "vitest";
import { VoiceSessionNotFoundException } from "../../../src/Domain/Exceptions/index";

describe("VoiceSessionNotFoundException", () => {

    it("creates an exception with the correct message", () => {
        const ex = new VoiceSessionNotFoundException("session-1");
        expect(ex.message).toBe("Voice session not found: session-1");
        expect(ex.name).toBe("VoiceSessionNotFoundException");
    });

    it("is an instance of Error", () => {
        const ex = new VoiceSessionNotFoundException("session-1");
        expect(ex).toBeInstanceOf(Error);
    });

});
