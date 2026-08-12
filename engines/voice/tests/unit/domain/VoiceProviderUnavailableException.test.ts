import { describe, it, expect } from "vitest";
import { VoiceProviderUnavailableException } from "../../../src/Domain/Exceptions/index";

describe("VoiceProviderUnavailableException", () => {

    it("creates an exception with the correct message", () => {
        const ex = new VoiceProviderUnavailableException("provider-1");
        expect(ex.message).toBe("Voice provider unavailable: provider-1");
        expect(ex.name).toBe("VoiceProviderUnavailableException");
    });

    it("is an instance of Error", () => {
        const ex = new VoiceProviderUnavailableException("provider-1");
        expect(ex).toBeInstanceOf(Error);
    });

});
