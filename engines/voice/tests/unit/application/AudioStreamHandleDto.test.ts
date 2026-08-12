import { describe, it, expect } from "vitest";
import { AudioStreamHandleDto } from "../../../src/Application/DTO/AudioStreamHandleDto";

describe("AudioStreamHandleDto", () => {
    it("creates with all properties", () => {
        const dto = new AudioStreamHandleDto("stream-1", "req-1", "voice-1", "provider-1", "profile-1", "streaming", 5000, "corr-1");
        expect(dto.streamId).toBe("stream-1");
        expect(dto.requestId).toBe("req-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.providerId).toBe("provider-1");
        expect(dto.profileId).toBe("profile-1");
        expect(dto.status).toBe("streaming");
        expect(dto.estimatedDurationMs).toBe(5000);
        expect(dto.correlationId).toBe("corr-1");
    });

    it("creates from result object", () => {
        const result = {
            streamId: "stream-1",
            requestId: "req-1",
            voiceId: "voice-1",
            providerId: "provider-1",
            profileId: "profile-1",
            status: "streaming",
            estimatedDurationMs: 5000,
            correlationId: "corr-1"
        };
        const dto = AudioStreamHandleDto.fromResult(result);
        expect(dto.streamId).toBe("stream-1");
        expect(dto.requestId).toBe("req-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.providerId).toBe("provider-1");
        expect(dto.profileId).toBe("profile-1");
        expect(dto.status).toBe("streaming");
        expect(dto.estimatedDurationMs).toBe(5000);
        expect(dto.correlationId).toBe("corr-1");
    });

    it("fromResult returns a new instance each call", () => {
        const result = {
            streamId: "stream-1",
            requestId: "req-1",
            voiceId: "voice-1",
            providerId: "provider-1",
            profileId: "profile-1",
            status: "streaming",
            estimatedDurationMs: 5000,
            correlationId: "corr-1"
        };
        const dto1 = AudioStreamHandleDto.fromResult(result);
        const dto2 = AudioStreamHandleDto.fromResult(result);
        expect(dto1).not.toBe(dto2);
        expect(dto1.streamId).toBe(dto2.streamId);
    });
});
