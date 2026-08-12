import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateVoiceProfileCommandHandler } from "../../../src/Application/Handlers/CreateVoiceProfileCommandHandler";
import { CreateVoiceProfileCommand } from "../../../src/Application/Commands/CreateVoiceProfileCommand";

describe("CreateVoiceProfileCommandHandler", () => {
    let mockVoiceEngine: any;
    let mockEventBus: any;
    let handler: CreateVoiceProfileCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            createVoiceProfile: vi.fn().mockResolvedValue(undefined)
        };
        mockEventBus = {};
        handler = new CreateVoiceProfileCommandHandler(mockVoiceEngine, mockEventBus);
    });

    it("calls voiceEngine.createVoiceProfile with valid command", async () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.createVoiceProfile).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.createVoiceProfile).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.createVoiceProfile).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.createVoiceProfile).not.toHaveBeenCalled();
    });

    it("validates command before calling voiceEngine", async () => {
        const command = new CreateVoiceProfileCommand("", "voice-1", "en-US", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await expect(handler.handle(command)).rejects.toThrow("CharacterId is required.");
        expect(mockVoiceEngine.createVoiceProfile).not.toHaveBeenCalled();
    });
});
