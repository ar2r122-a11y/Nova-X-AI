import { describe, it, expect, vi, beforeEach } from "vitest";
import { SynthesizeSpeechCommandHandler } from "../../../src/Application/Handlers/SynthesizeSpeechCommandHandler";
import { SynthesizeSpeechCommand } from "../../../src/Application/Commands/SynthesizeSpeechCommand";

describe("SynthesizeSpeechCommandHandler", () => {
    let mockVoiceEngine: any;
    let mockEventBus: any;
    let handler: SynthesizeSpeechCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            synthesizeSpeech: vi.fn().mockResolvedValue(undefined)
        };
        mockEventBus = {};
        handler = new SynthesizeSpeechCommandHandler(mockVoiceEngine, mockEventBus);
    });

    it("calls voiceEngine.synthesizeSpeech with valid command", async () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1", "provider-1", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.synthesizeSpeech).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.synthesizeSpeech).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1", "provider-1", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.synthesizeSpeech).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1", "provider-1", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.synthesizeSpeech).not.toHaveBeenCalled();
    });

    it("validates command before calling voiceEngine", async () => {
        const command = new SynthesizeSpeechCommand("", "Hello", "profile-1", "provider-1", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await expect(handler.handle(command)).rejects.toThrow("VoiceId is required.");
        expect(mockVoiceEngine.synthesizeSpeech).not.toHaveBeenCalled();
    });
});
