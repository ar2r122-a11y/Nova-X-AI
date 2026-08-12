import { describe, it, expect } from "vitest";
import { VoiceSynthesisResultDto } from "../../../src/Application/DTO/VoiceSynthesisResultDto";

describe("VoiceSynthesisResultDto", () => {
    it("creates with all properties", () => {
        const dto = new VoiceSynthesisResultDto("req-1", "voice-1", "completed", 5000, 10, "provider-1", 150000, "corr-1");
        expect(dto.requestId).toBe("req-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.status).toBe("completed");
        expect(dto.durationMs).toBe(5000);
        expect(dto.totalChunks).toBe(10);
        expect(dto.providerId).toBe("provider-1");
        expect(dto.estimatedCostMicros).toBe(150000);
        expect(dto.correlationId).toBe("corr-1");
    });

    it("creates with zero values", () => {
        const dto = new VoiceSynthesisResultDto("req-1", "voice-1", "pending", 0, 0, "provider-1", 0, "corr-1");
        expect(dto.durationMs).toBe(0);
        expect(dto.totalChunks).toBe(0);
        expect(dto.estimatedCostMicros).toBe(0);
    });
});
