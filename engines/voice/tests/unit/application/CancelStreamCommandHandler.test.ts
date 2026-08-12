import { describe, it, expect, vi, beforeEach } from "vitest";
import { CancelStreamCommandHandler } from "../../../src/Application/Handlers/CancelStreamCommandHandler";
import { CancelStreamCommand } from "../../../src/Application/Commands/CancelStreamCommand";

describe("CancelStreamCommandHandler", () => {
    let mockVoiceEngine: any;
    let handler: CancelStreamCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            cancelStream: vi.fn().mockResolvedValue(undefined)
        };
        handler = new CancelStreamCommandHandler(mockVoiceEngine);
    });

    it("calls voiceEngine.cancelStream with valid command", async () => {
        const command = new CancelStreamCommand("voice-1", "stream-1", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.cancelStream).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.cancelStream).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new CancelStreamCommand("voice-1", "stream-1", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.cancelStream).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new CancelStreamCommand("voice-1", "stream-1", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.cancelStream).not.toHaveBeenCalled();
    });
});
