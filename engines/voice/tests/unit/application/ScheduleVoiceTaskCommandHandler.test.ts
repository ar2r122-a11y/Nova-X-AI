import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScheduleVoiceTaskCommandHandler } from "../../../src/Application/Handlers/ScheduleVoiceTaskCommandHandler";
import { ScheduleVoiceTaskCommand } from "../../../src/Application/Commands/ScheduleVoiceTaskCommand";

describe("ScheduleVoiceTaskCommandHandler", () => {
    let mockVoiceEngine: any;
    let mockEventBus: any;
    let handler: ScheduleVoiceTaskCommandHandler;

    beforeEach(() => {
        mockVoiceEngine = {
            scheduleVoiceTask: vi.fn().mockResolvedValue(undefined)
        };
        mockEventBus = {};
        handler = new ScheduleVoiceTaskCommandHandler(mockVoiceEngine, mockEventBus);
    });

    it("calls voiceEngine.scheduleVoiceTask with valid command", async () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3, "corr-1", "caus-1", { roles: ["user"], permissions: ["read"] });
        await handler.handle(command);
        expect(mockVoiceEngine.scheduleVoiceTask).toHaveBeenCalledTimes(1);
        expect(mockVoiceEngine.scheduleVoiceTask).toHaveBeenCalledWith(command);
    });

    it("throws when claims roles is empty", async () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3, "corr-1", "caus-1", { roles: [], permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.scheduleVoiceTask).not.toHaveBeenCalled();
    });

    it("throws when claims is missing roles", async () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3, "corr-1", "caus-1", { roles: undefined as any, permissions: [] });
        await expect(handler.handle(command)).rejects.toThrow("Unauthenticated: user claims must contain at least one role.");
        expect(mockVoiceEngine.scheduleVoiceTask).not.toHaveBeenCalled();
    });
});
