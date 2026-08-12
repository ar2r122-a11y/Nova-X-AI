import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetVoiceSessionQueryHandler } from "../../../src/Application/Handlers/GetVoiceSessionQueryHandler";
import { GetVoiceSessionQuery } from "../../../src/Application/Queries/GetVoiceSessionQuery";
import { VoiceSessionDto } from "../../../src/Application/DTO/VoiceSessionDto";

describe("GetVoiceSessionQueryHandler", () => {
    let mockSessionRepository: any;
    let handler: GetVoiceSessionQueryHandler;

    beforeEach(() => {
        mockSessionRepository = {};
        handler = new GetVoiceSessionQueryHandler(mockSessionRepository);
    });

    it("throws when session not found", async () => {
        mockSessionRepository.findById = vi.fn().mockResolvedValue(null);
        const query = new GetVoiceSessionQuery("session-1", "user-1");
        await expect(handler.handle(query)).rejects.toThrow("Voice session not found: session-1");
        expect(mockSessionRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("returns VoiceSessionDto when session found", async () => {
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
        mockSessionRepository.findById = vi.fn().mockResolvedValue(aggregate);
        const query = new GetVoiceSessionQuery("session-1", "user-1");
        const result = await handler.handle(query);
        expect(result).toBeInstanceOf(VoiceSessionDto);
        expect(result.sessionId).toBe("session-1");
        expect(result.voiceId).toBe("voice-1");
        expect(mockSessionRepository.findById).toHaveBeenCalledTimes(1);
    });
});
