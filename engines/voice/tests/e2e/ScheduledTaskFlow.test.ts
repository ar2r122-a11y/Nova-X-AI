import { describe, it, expect, beforeEach, vi } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";

describe("ScheduledTaskFlow", () => {
    it("schedules and processes delayed voice tasks", async () => {
        const engine = new VoiceEngine(
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            { save: vi.fn() } as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any
        );

        await expect(
            engine.scheduleVoiceTask({
                voiceId: "voice-123",
                text: "Scheduled task",
                voiceProfileId: "profile-123",
                scheduledAt: Date.now() + 1000,
                priority: 1,
                claims: { roles: ["user"] },
                correlationId: "corr-1"
            } as any)
        ).resolves.toBeUndefined();
    });
});
