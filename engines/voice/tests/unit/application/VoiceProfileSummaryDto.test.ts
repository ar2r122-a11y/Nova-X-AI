import { describe, it, expect } from "vitest";
import { VoiceProfileSummaryDto } from "../../../src/Application/DTO/VoiceProfileSummaryDto";

describe("VoiceProfileSummaryDto", () => {
    it("creates with all properties", () => {
        const dto = new VoiceProfileSummaryDto("profile-1", "char-1", "voice-1", "en-US", 1.0, 2);
        expect(dto.profileId).toBe("profile-1");
        expect(dto.characterId).toBe("char-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.locale).toBe("en-US");
        expect(dto.speakingRate).toBe(1.0);
        expect(dto.configurationVersion).toBe(2);
    });

    it("creates with default values", () => {
        const dto = new VoiceProfileSummaryDto("profile-1", "char-1", "voice-1", "en-US", 1.0, 1);
        expect(dto.speakingRate).toBe(1.0);
        expect(dto.configurationVersion).toBe(1);
    });
});
