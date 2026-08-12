import { describe, it, expect, vi, beforeEach } from "vitest";
import { InterruptCommandHandler } from "../../../src/Application/Handlers/InterruptCommandHandler";
import { InterruptCommand } from "../../../src/Application/Commands/InterruptCommand";

describe("InterruptCommandHandler", () => {
    let mockVoiceEngine: any;
    let handler: InterruptCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            interrupt: vi.fn().mockResolvedValue(undefined)
        };
        handler = new InterruptCommandHandler(mockVoiceEngine);
    });

    it("calls voiceEngine.interrupt with valid command", async () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.interrupt).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.interrupt).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.interrupt).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.interrupt).not.toHaveBeenCalled();
    });

    it("validates command before calling voiceEngine", async () => {
        const command = new InterruptCommand("", "req-1", "user request", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await expect(handler.handle(command)).rejects.toThrow("VoiceId is required.");
        expect(mockVoiceEngine.interrupt).not.toHaveBeenCalled();
    });
});
