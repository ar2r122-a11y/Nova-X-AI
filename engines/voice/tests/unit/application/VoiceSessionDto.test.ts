import { describe, it, expect } from "vitest";
import { VoiceSessionDto } from "../../../src/Application/DTO/VoiceSessionDto";

describe("VoiceSessionDto", () => {
    it("creates with all properties", () => {
        const dto = new VoiceSessionDto("session-1", "voice-1", "profile-1", "active", 1700000000000, null, 5000, "Hello world");
        expect(dto.sessionId).toBe("session-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.profileId).toBe("profile-1");
        expect(dto.state).toBe("active");
        expect(dto.startedAt).toBe(1700000000000);
        expect(dto.endedAt).toBeNull();
        expect(dto.totalAudioDurationMs).toBe(5000);
        expect(dto.text).toBe("Hello world");
    });

    it("creates with endedAt set", () => {
        const dto = new VoiceSessionDto("session-1", "voice-1", "profile-1", "completed", 1700000000000, 1700000005000, 5000, "Hello world");
        expect(dto.endedAt).toBe(1700000005000);
    });

    it("creates from aggregate", () => {
        const aggregate = {
            getSessionId: () => ({ getValue: () => "session-1" }),
            getVoiceId: () => ({ getValue: () => "voice-1" }),
            getProfileId: () => ({ getValue: () => "profile-1" }),
            getSessionState: () => ({ getValue: () => "active" }),
            getStartedAt: () => 1700000000000,
            getEndedAt: () => null,
            getTotalAudioDurationMs: () => 5000,
            getText: () => "Hello world"
        };
        const dto = VoiceSessionDto.fromAggregate(aggregate as any);
        expect(dto.sessionId).toBe("session-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.profileId).toBe("profile-1");
        expect(dto.state).toBe("active");
        expect(dto.startedAt).toBe(1700000000000);
        expect(dto.endedAt).toBeNull();
        expect(dto.totalAudioDurationMs).toBe(5000);
        expect(dto.text).toBe("Hello world");
    });

    it("fromAggregate handles endedAt as number", () => {
        const aggregate = {
            getSessionId: () => ({ getValue: () => "session-1" }),
            getVoiceId: () => ({ getValue: () => "voice-1" }),
            getProfileId: () => ({ getValue: () => "profile-1" }),
            getSessionState: () => ({ getValue: () => "completed" }),
            getStartedAt: () => 1700000000000,
            getEndedAt: () => 1700000005000,
            getTotalAudioDurationMs: () => 5000,
            getText: () => "Hello world"
        };
        const dto = VoiceSessionDto.fromAggregate(aggregate as any);
        expect(dto.endedAt).toBe(1700000005000);
    });

    it("fromAggregate returns a new instance each call", () => {
        const aggregate = {
            getSessionId: () => ({ getValue: () => "session-1" }),
            getVoiceId: () => ({ getValue: () => "voice-1" }),
            getProfileId: () => ({ getValue: () => "profile-1" }),
            getSessionState: () => ({ getValue: () => "active" }),
            getStartedAt: () => 1700000000000,
            getEndedAt: () => null,
            getTotalAudioDurationMs: () => 5000,
            getText: () => "Hello world"
        };
        const dto1 = VoiceSessionDto.fromAggregate(aggregate as any);
        const dto2 = VoiceSessionDto.fromAggregate(aggregate as any);
        expect(dto1).not.toBe(dto2);
        expect(dto1.sessionId).toBe(dto2.sessionId);
    });
});
