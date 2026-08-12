import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskPriorityQueue } from "../../../src/Infrastructure/Scheduling";
import { ScheduledVoiceTaskEntity } from "../../../src/Domain/Entities/ScheduledVoiceTaskEntity";

describe("TaskPriorityQueue", () => {
    let queue: TaskPriorityQueue;

    beforeEach(() => {
        queue = new TaskPriorityQueue();
    });

    describe("enqueue", () => {

        it("adds a task to the queue", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            queue.enqueue(task);
            expect(queue.size()).toBe(1);
        });

    });

    describe("dequeue", () => {

        it("returns the highest priority task", () => {
            const lowPriority = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            const highPriority = ScheduledVoiceTaskEntity.create("task-2", "voice-2", "World", "profile-2", Date.now(), 5, 3);
            queue.enqueue(lowPriority);
            queue.enqueue(highPriority);
            const dequeued = queue.dequeue();
            expect(dequeued).toBe(highPriority);
        });

        it("returns undefined when queue is empty", () => {
            expect(queue.dequeue()).toBeUndefined();
        });

        it("returns tasks in priority order", () => {
            const task1 = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "A", "profile-1", Date.now(), 1, 3);
            const task2 = ScheduledVoiceTaskEntity.create("task-2", "voice-2", "B", "profile-2", Date.now(), 3, 3);
            const task3 = ScheduledVoiceTaskEntity.create("task-3", "voice-3", "C", "profile-3", Date.now(), 2, 3);
            queue.enqueue(task1);
            queue.enqueue(task2);
            queue.enqueue(task3);

            expect(queue.dequeue()?.getTaskId()).toBe("task-2");
            expect(queue.dequeue()?.getTaskId()).toBe("task-3");
            expect(queue.dequeue()?.getTaskId()).toBe("task-1");
        });

        it("returns one of the equal priority tasks", () => {
            const task1 = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "A", "profile-1", Date.now(), 1, 3);
            const task2 = ScheduledVoiceTaskEntity.create("task-2", "voice-2", "B", "profile-2", Date.now(), 1, 3);
            queue.enqueue(task1);
            queue.enqueue(task2);
            const dequeued = queue.dequeue();
            expect(dequeued).toBeDefined();
            expect(dequeued?.getPriority()).toBe(1);
        });

    });

    describe("size", () => {

        it("returns the number of tasks in the queue", () => {
            expect(queue.size()).toBe(0);
            queue.enqueue(ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3));
            expect(queue.size()).toBe(1);
            queue.enqueue(ScheduledVoiceTaskEntity.create("task-2", "voice-2", "World", "profile-2", Date.now(), 2, 3));
            expect(queue.size()).toBe(2);
        });

    });

    describe("clear", () => {

        it("removes all tasks from the queue", () => {
            queue.enqueue(ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3));
            queue.enqueue(ScheduledVoiceTaskEntity.create("task-2", "voice-2", "World", "profile-2", Date.now(), 2, 3));
            queue.clear();
            expect(queue.size()).toBe(0);
            expect(queue.dequeue()).toBeUndefined();
        });

    });

});
