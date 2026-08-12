import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResumeCommandHandler } from "../../../src/Application/Handlers/ResumeCommandHandler";
import { ResumeCommand } from "../../../src/Application/Commands/ResumeCommand";

describe("ResumeCommandHandler", () => {
    let mockVoiceEngine: any;
    let handler: ResumeCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            resume: vi.fn().mockResolvedValue(undefined)
        };
        handler = new ResumeCommandHandler(mockVoiceEngine);
    });

    it("calls voiceEngine.resume with valid command", async () => {
        const command = new ResumeCommand("voice-1", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.resume).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.resume).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new ResumeCommand("voice-1", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.resume).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new ResumeCommand("voice-1", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.resume).not.toHaveBeenCalled();
    });
});
