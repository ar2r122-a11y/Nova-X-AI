import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegenerateAudioCommandHandler } from "../../../src/Application/Handlers/RegenerateAudioCommandHandler";
import { RegenerateAudioCommand } from "../../../src/Application/Commands/RegenerateAudioCommand";

describe("RegenerateAudioCommandHandler", () => {
    let mockVoiceEngine: any;
    let handler: RegenerateAudioCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            regenerateAudio: vi.fn().mockResolvedValue({} as any)
        };
        handler = new RegenerateAudioCommandHandler(mockVoiceEngine);
    });

    it("calls voiceEngine.regenerateAudio with valid command", async () => {
        const command = new RegenerateAudioCommand("voice-1", "req-1", "Hello", "profile-1", "provider-1", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.regenerateAudio).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.regenerateAudio).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new RegenerateAudioCommand("voice-1", "req-1", "Hello", "profile-1", "provider-1", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.regenerateAudio).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new RegenerateAudioCommand("voice-1", "req-1", "Hello", "profile-1", "provider-1", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.regenerateAudio).not.toHaveBeenCalled();
    });
});
