import { describe, it, expect, vi, beforeEach } from "vitest";
import { RetryUtteranceCommandHandler } from "../../../src/Application/Handlers/RetryUtteranceCommandHandler";
import { RetryUtteranceCommand } from "../../../src/Application/Commands/RetryUtteranceCommand";

describe("RetryUtteranceCommandHandler", () => {
    let mockVoiceEngine: any;
    let handler: RetryUtteranceCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            retryUtterance: vi.fn().mockResolvedValue({} as any)
        };
        handler = new RetryUtteranceCommandHandler(mockVoiceEngine);
    });

    it("calls voiceEngine.retryUtterance with valid command", async () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.retryUtterance).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.retryUtterance).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.retryUtterance).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.retryUtterance).not.toHaveBeenCalled();
    });
});
