import { describe, it, expect } from "vitest";
import { VoiceQuotaExceededException } from "../../../src/Domain/Exceptions/index";

describe("VoiceQuotaExceededException", () => {

    it("creates an exception with the correct message", () => {
        const ex = new VoiceQuotaExceededException("daily");
        expect(ex.message).toBe("Voice quota exceeded: daily");
        expect(ex.name).toBe("VoiceQuotaExceededException");
    });

    it("is an instance of Error", () => {
        const ex = new VoiceQuotaExceededException("monthly");
        expect(ex).toBeInstanceOf(Error);
    });

});
