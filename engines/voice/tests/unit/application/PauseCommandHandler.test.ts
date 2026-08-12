import { describe, it, expect, vi, beforeEach } from "vitest";
import { PauseCommandHandler } from "../../../src/Application/Handlers/PauseCommandHandler";
import { PauseCommand } from "../../../src/Application/Commands/PauseCommand";

describe("PauseCommandHandler", () => {
    let mockVoiceEngine: any;
    let handler: PauseCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            pause: vi.fn().mockResolvedValue(undefined)
        };
        handler = new PauseCommandHandler(mockVoiceEngine);
    });

    it("calls voiceEngine.pause with valid command", async () => {
        const command = new PauseCommand("voice-1", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.pause).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.pause).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new PauseCommand("voice-1", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.pause).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new PauseCommand("voice-1", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.pause).not.toHaveBeenCalled();
    });
});
