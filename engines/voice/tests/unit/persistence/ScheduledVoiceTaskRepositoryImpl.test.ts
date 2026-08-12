import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScheduledVoiceTaskRepositoryImpl } from "../../../src/Infrastructure/Persistence/ScheduledVoiceTaskRepositoryImpl";
import { ScheduledVoiceTaskEntity } from "../../../src/Domain/Entities/ScheduledVoiceTaskEntity";

describe("ScheduledVoiceTaskRepositoryImpl", () => {
    let mockStorageEngine: any;
    let repository: ScheduledVoiceTaskRepositoryImpl;

    beforeEach(() => {
        mockStorageEngine = {
            getRepository: vi.fn().mockReturnValue({
                getById: vi.fn(),
                save: vi.fn(),
                delete: vi.fn(),
                exists: vi.fn(),
                getAll: vi.fn()
            })
        };
        repository = new ScheduledVoiceTaskRepositoryImpl(mockStorageEngine);
    });

    describe("findById", () => {
        it("returns null when task not found", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue(null);

            const result = await repository.findById("task-1");
            expect(result).toBeNull();
            expect(repo.getById).toHaveBeenCalledWith("task-1");
        });

        it("reconstitutes ScheduledVoiceTaskEntity from stored snapshot", async () => {
            const snapshot = {
                taskId: "task-1",
                voiceId: "voice-1",
                text: "say hello",
                profileId: "profile-1",
                scheduledAt: 1000,
                priority: 5,
                maxRetries: 3,
                retryCount: 1,
                status: "pending",
                lastError: null,
                createdAt: 500,
                updatedAt: 800
            };
            const repo = mockStorageEngine.getRepository();
            repo.getById.mockResolvedValue({ id: "task-1", data: JSON.stringify(snapshot) });

            const result = await repository.findById("task-1");
            expect(result).toBeInstanceOf(ScheduledVoiceTaskEntity);
            expect(result!.getTaskId()).toBe("task-1");
            expect(result!.getVoiceId()).toBe("voice-1");
            expect(result!.getText()).toBe("say hello");
            expect(result!.getStatus()).toBe("pending");
            expect(result!.getRetryCount()).toBe(1);
        });
    });

    describe("findByVoiceId", () => {
        it("returns empty array when no tasks match", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([]);

            const result = await repository.findByVoiceId("voice-1");
            expect(result).toEqual([]);
        });

        it("filters and reconstitutes tasks by voiceId", async () => {
            const task1 = {
                taskId: "task-1", voiceId: "voice-1", text: "hello", profileId: "p1",
                scheduledAt: 1000, priority: 1, maxRetries: 3, retryCount: 0,
                status: "pending", lastError: null, createdAt: 500, updatedAt: 500
            };
            const task2 = {
                taskId: "task-2", voiceId: "voice-2", text: "world", profileId: "p2",
                scheduledAt: 2000, priority: 2, maxRetries: 3, retryCount: 0,
                status: "pending", lastError: null, createdAt: 600, updatedAt: 600
            };
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([
                { id: "task-1", data: JSON.stringify(task1) },
                { id: "task-2", data: JSON.stringify(task2) }
            ]);

            const result = await repository.findByVoiceId("voice-1");
            expect(result).toHaveLength(1);
            expect(result[0].getTaskId()).toBe("task-1");
        });
    });

    describe("findAll", () => {
        it("returns all tasks", async () => {
            const task = {
                taskId: "task-1", voiceId: "voice-1", text: "hello", profileId: "p1",
                scheduledAt: 1000, priority: 1, maxRetries: 3, retryCount: 0,
                status: "pending", lastError: null, createdAt: 500, updatedAt: 500
            };
            const repo = mockStorageEngine.getRepository();
            repo.getAll.mockResolvedValue([
                { id: "task-1", data: JSON.stringify(task) }
            ]);

            const result = await repository.findAll();
            expect(result).toHaveLength(1);
            expect(result[0].getTaskId()).toBe("task-1");
        });
    });

    describe("save", () => {
        it("serializes and saves task", async () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "hello", "profile-1", 1000, 1, 3);
            const repo = mockStorageEngine.getRepository();
            repo.save.mockResolvedValue(undefined);

            await repository.save(task);

            expect(repo.save).toHaveBeenCalledTimes(1);
            const savedEntity = repo.save.mock.calls[0][0];
            expect(savedEntity.id).toBe("task-1");
            const parsed = JSON.parse(savedEntity.data);
            expect(parsed.taskId).toBe("task-1");
        });
    });

    describe("delete", () => {
        it("deletes task by id", async () => {
            const repo = mockStorageEngine.getRepository();
            repo.delete.mockResolvedValue(undefined);

            await repository.delete("task-1");

            expect(repo.delete).toHaveBeenCalledWith("task-1");
        });
    });
});
