import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateVoiceProfileCommandHandler } from "../../../src/Application/Handlers/UpdateVoiceProfileCommandHandler";
import { UpdateVoiceProfileCommand } from "../../../src/Application/Commands/UpdateVoiceProfileCommand";

describe("UpdateVoiceProfileCommandHandler", () => {
    let mockVoiceEngine: any;
    let handler: UpdateVoiceProfileCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            updateVoiceProfile: vi.fn().mockResolvedValue(undefined)
        };
        handler = new UpdateVoiceProfileCommandHandler(mockVoiceEngine);
    });

    it("calls voiceEngine.updateVoiceProfile with valid command", async () => {
        const command = new UpdateVoiceProfileCommand("profile-1", 1.2, 0.5, ["stability"], { version: "v2" }, { provider: "openai" }, "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.updateVoiceProfile).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.updateVoiceProfile).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new UpdateVoiceProfileCommand("profile-1", 1.2, 0.5, ["stability"], { version: "v2" }, { provider: "openai" }, "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.updateVoiceProfile).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new UpdateVoiceProfileCommand("profile-1", 1.2, 0.5, ["stability"], { version: "v2" }, { provider: "openai" }, "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.updateVoiceProfile).not.toHaveBeenCalled();
    });

    it("validates command before calling voiceEngine", async () => {
        const command = new UpdateVoiceProfileCommand("", 1.2, 0.5, ["stability"], { version: "v2" }, { provider: "openai" }, "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await expect(handler.handle(command)).rejects.toThrow("ProfileId is required.");
        expect(mockVoiceEngine.updateVoiceProfile).not.toHaveBeenCalled();
    });
});
