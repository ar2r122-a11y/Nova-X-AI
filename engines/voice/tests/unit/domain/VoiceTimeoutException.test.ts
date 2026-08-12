import { describe, it, expect } from "vitest";
import { VoiceTimeoutException } from "../../../src/Domain/Exceptions/index";

describe("VoiceTimeoutException", () => {

    it("creates an exception with the correct message", () => {
        const ex = new VoiceTimeoutException(5000);
        expect(ex.message).toBe("Voice operation timed out after 5000ms");
        expect(ex.name).toBe("VoiceTimeoutException");
    });

    it("is an instance of Error", () => {
        const ex = new VoiceTimeoutException(3000);
        expect(ex).toBeInstanceOf(Error);
    });

});
