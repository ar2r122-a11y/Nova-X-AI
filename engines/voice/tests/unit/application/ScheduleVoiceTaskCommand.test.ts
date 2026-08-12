import { describe, it, expect } from "vitest";
import { ScheduleVoiceTaskCommand } from "../../../src/Application/Commands/ScheduleVoiceTaskCommand";

describe("ScheduleVoiceTaskCommand", () => {
    it("creates with all required properties", () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3);
        expect(command.voiceId).toBe("voice-1");
        expect(command.text).toBe("Hello");
        expect(command.profileId).toBe("profile-1");
        expect(command.scheduledAt).toBe(1700000000000);
        expect(command.priority).toBe(5);
        expect(command.maxRetries).toBe(3);
    });

    it("generates correlationId by default", () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3);
        expect(command.correlationId).toMatch(/^schedule-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3, "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3);
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3);
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["admin"], permissions: ["write"] };
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3, "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new ScheduleVoiceTaskCommand("voice-1", "Hello", "profile-1", 1700000000000, 5, 3);
        expect(typeof command).toBe("object");
        expect("voiceId" in command).toBe(true);
        expect("text" in command).toBe(true);
        expect("profileId" in command).toBe(true);
        expect("scheduledAt" in command).toBe(true);
        expect("priority" in command).toBe(true);
        expect("maxRetries" in command).toBe(true);
    });
});
