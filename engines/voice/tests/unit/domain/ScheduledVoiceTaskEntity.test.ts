import { describe, it, expect } from "vitest";
import { ScheduledVoiceTaskEntity } from "../../../src/Domain/Entities/ScheduledVoiceTaskEntity";

describe("ScheduledVoiceTaskEntity", () => {

    describe("create", () => {

        it("creates a pending task with default values", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            expect(task.getTaskId()).toBe("task-1");
            expect(task.getVoiceId()).toBe("voice-1");
            expect(task.getText()).toBe("Hello");
            expect(task.getProfileId()).toBe("profile-1");
            expect(task.getPriority()).toBe(1);
            expect(task.getMaxRetries()).toBe(3);
            expect(task.getStatus()).toBe("pending");
            expect(task.getRetryCount()).toBe(0);
            expect(task.getLastError()).toBeNull();
        });

    });

    describe("getters", () => {

        it("returns scheduledAt timestamp", () => {
            const scheduledAt = Date.now() + 1000;
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", scheduledAt, 1, 3);
            expect(task.getScheduledAt()).toBe(scheduledAt);
        });

        it("returns createdAt timestamp", () => {
            const before = Date.now();
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            const after = Date.now();
            expect(task.getCreatedAt()).toBeGreaterThanOrEqual(before);
            expect(task.getCreatedAt()).toBeLessThanOrEqual(after);
        });

    });

    describe("incrementRetry", () => {

        it("increments the retry count", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            expect(task.getRetryCount()).toBe(0);
            task.incrementRetry();
            expect(task.getRetryCount()).toBe(1);
            task.incrementRetry();
            expect(task.getRetryCount()).toBe(2);
        });

        it("updates the updatedAt timestamp", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            const before = Date.now();
            task.incrementRetry();
            expect(task.getUpdatedAt()).toBeGreaterThanOrEqual(before);
        });

    });

    describe("markCompleted", () => {

        it("sets status to completed", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            task.markCompleted();
            expect(task.getStatus()).toBe("completed");
        });

        it("updates the updatedAt timestamp", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            const before = Date.now();
            task.markCompleted();
            expect(task.getUpdatedAt()).toBeGreaterThanOrEqual(before);
        });

    });

    describe("markFailed", () => {

        it("sets status to failed and records the error", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            task.markFailed("network error");
            expect(task.getStatus()).toBe("failed");
            expect(task.getLastError()).toBe("network error");
        });

        it("updates the updatedAt timestamp", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            const before = Date.now();
            task.markFailed("error");
            expect(task.getUpdatedAt()).toBeGreaterThanOrEqual(before);
        });

    });

});
