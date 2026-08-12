import { describe, it, expect } from "vitest";
import { ScheduledVoiceTaskDto } from "../../../src/Application/DTO/ScheduledVoiceTaskDto";

describe("ScheduledVoiceTaskDto", () => {
    it("creates with all properties", () => {
        const dto = new ScheduledVoiceTaskDto("task-1", "voice-1", "Hello", "profile-1", 1700000000000, 5, "pending", 0, 3);
        expect(dto.taskId).toBe("task-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.text).toBe("Hello");
        expect(dto.profileId).toBe("profile-1");
        expect(dto.scheduledAt).toBe(1700000000000);
        expect(dto.priority).toBe(5);
        expect(dto.status).toBe("pending");
        expect(dto.retryCount).toBe(0);
        expect(dto.maxRetries).toBe(3);
    });

    it("creates from entity", () => {
        const entity = {
            getTaskId: () => "task-1",
            getVoiceId: () => "voice-1",
            getText: () => "Hello",
            getProfileId: () => "profile-1",
            getScheduledAt: () => 1700000000000,
            getPriority: () => 5,
            getStatus: () => "pending",
            getRetryCount: () => 0,
            getMaxRetries: () => 3
        };
        const dto = ScheduledVoiceTaskDto.fromEntity(entity);
        expect(dto.taskId).toBe("task-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.text).toBe("Hello");
        expect(dto.profileId).toBe("profile-1");
        expect(dto.scheduledAt).toBe(1700000000000);
        expect(dto.priority).toBe(5);
        expect(dto.status).toBe("pending");
        expect(dto.retryCount).toBe(0);
        expect(dto.maxRetries).toBe(3);
    });

    it("fromEntity handles completed task", () => {
        const entity = {
            getTaskId: () => "task-1",
            getVoiceId: () => "voice-1",
            getText: () => "Hello",
            getProfileId: () => "profile-1",
            getScheduledAt: () => 1700000000000,
            getPriority: () => 1,
            getStatus: () => "completed",
            getRetryCount: () => 2,
            getMaxRetries: () => 3
        };
        const dto = ScheduledVoiceTaskDto.fromEntity(entity);
        expect(dto.status).toBe("completed");
        expect(dto.retryCount).toBe(2);
        expect(dto.maxRetries).toBe(3);
    });

    it("fromEntity returns a new instance each call", () => {
        const entity = {
            getTaskId: () => "task-1",
            getVoiceId: () => "voice-1",
            getText: () => "Hello",
            getProfileId: () => "profile-1",
            getScheduledAt: () => 1700000000000,
            getPriority: () => 5,
            getStatus: () => "pending",
            getRetryCount: () => 0,
            getMaxRetries: () => 3
        };
        const dto1 = ScheduledVoiceTaskDto.fromEntity(entity);
        const dto2 = ScheduledVoiceTaskDto.fromEntity(entity);
        expect(dto1).not.toBe(dto2);
        expect(dto1.taskId).toBe(dto2.taskId);
    });
});
