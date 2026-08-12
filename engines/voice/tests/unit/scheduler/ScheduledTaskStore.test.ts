import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScheduledTaskStore } from "../../../src/Infrastructure/Scheduling";
import { ScheduledVoiceTaskEntity } from "../../../src/Domain/Entities/ScheduledVoiceTaskEntity";

describe("ScheduledTaskStore", () => {
    let store: ScheduledTaskStore;

    beforeEach(() => {
        store = new ScheduledTaskStore();
    });

    describe("add", () => {

        it("adds a task to the store", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            store.add(task);
            expect(store.get("task-1")).toBe(task);
        });

        it("overwrites an existing task with the same id", () => {
            const task1 = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            const task2 = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "World", "profile-2", Date.now(), 2, 3);
            store.add(task1);
            store.add(task2);
            expect(store.get("task-1")).toBe(task2);
        });

    });

    describe("get", () => {

        it("returns the task by id", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            store.add(task);
            expect(store.get("task-1")).toBe(task);
        });

        it("returns undefined for unknown id", () => {
            expect(store.get("unknown")).toBeUndefined();
        });

    });

    describe("remove", () => {

        it("removes a task by id", () => {
            const task = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            store.add(task);
            store.remove("task-1");
            expect(store.get("task-1")).toBeUndefined();
        });

        it("does nothing when removing unknown id", () => {
            expect(() => store.remove("unknown")).not.toThrow();
        });

    });

    describe("getAll", () => {

        it("returns all tasks", () => {
            const task1 = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            const task2 = ScheduledVoiceTaskEntity.create("task-2", "voice-2", "World", "profile-2", Date.now(), 2, 3);
            store.add(task1);
            store.add(task2);
            const all = store.getAll();
            expect(all).toHaveLength(2);
            expect(all).toContain(task1);
            expect(all).toContain(task2);
        });

        it("returns empty array when store is empty", () => {
            expect(store.getAll()).toEqual([]);
        });

    });

    describe("getDue", () => {

        it("returns pending tasks with scheduledAt <= now", () => {
            const now = Date.now();
            const pastTask = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", now - 1000, 1, 3);
            const futureTask = ScheduledVoiceTaskEntity.create("task-2", "voice-2", "World", "profile-2", now + 1000, 1, 3);
            const completedTask = ScheduledVoiceTaskEntity.create("task-3", "voice-3", "Done", "profile-3", now - 1000, 1, 3);
            completedTask.markCompleted();

            store.add(pastTask);
            store.add(futureTask);
            store.add(completedTask);

            const due = store.getDue(now);
            expect(due).toHaveLength(1);
            expect(due[0]).toBe(pastTask);
        });

        it("returns empty array when no tasks are due", () => {
            const now = Date.now();
            const futureTask = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", now + 1000, 1, 3);
            store.add(futureTask);
            expect(store.getDue(now)).toEqual([]);
        });

    });

    describe("clear", () => {

        it("removes all tasks", () => {
            const task1 = ScheduledVoiceTaskEntity.create("task-1", "voice-1", "Hello", "profile-1", Date.now(), 1, 3);
            const task2 = ScheduledVoiceTaskEntity.create("task-2", "voice-2", "World", "profile-2", Date.now(), 2, 3);
            store.add(task1);
            store.add(task2);
            store.clear();
            expect(store.getAll()).toEqual([]);
        });

    });

});
