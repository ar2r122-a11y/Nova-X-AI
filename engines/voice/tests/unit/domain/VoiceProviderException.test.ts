import { describe, it, expect } from "vitest";
import { VoiceProviderException } from "../../../src/Domain/Exceptions/index";

describe("VoiceProviderException", () => {

    it("creates an exception with the correct message", () => {
        const ex = new VoiceProviderException("provider-1", "network error");
        expect(ex.message).toBe("Voice provider 'provider-1' error: network error");
        expect(ex.name).toBe("VoiceProviderException");
    });

    it("is an instance of Error", () => {
        const ex = new VoiceProviderException("provider-1", "timeout");
        expect(ex).toBeInstanceOf(Error);
    });

});
