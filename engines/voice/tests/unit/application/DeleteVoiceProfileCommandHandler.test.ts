import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteVoiceProfileCommandHandler } from "../../../src/Application/Handlers/DeleteVoiceProfileCommandHandler";
import { DeleteVoiceProfileCommand } from "../../../src/Application/Commands/DeleteVoiceProfileCommand";

describe("DeleteVoiceProfileCommandHandler", () => {
    let mockVoiceEngine: any;
    let handler: DeleteVoiceProfileCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            deleteVoiceProfile: vi.fn().mockResolvedValue(undefined)
        };
        handler = new DeleteVoiceProfileCommandHandler(mockVoiceEngine);
    });

    it("calls voiceEngine.deleteVoiceProfile with valid command", async () => {
        const command = new DeleteVoiceProfileCommand("profile-1", "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.deleteVoiceProfile).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.deleteVoiceProfile).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new DeleteVoiceProfileCommand("profile-1", "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.deleteVoiceProfile).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new DeleteVoiceProfileCommand("profile-1", "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.deleteVoiceProfile).not.toHaveBeenCalled();
    });
});
