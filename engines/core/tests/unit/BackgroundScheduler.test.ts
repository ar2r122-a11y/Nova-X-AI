import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BackgroundScheduler } from "../../src/scheduler/BackgroundScheduler";

describe("BackgroundScheduler", () => {

    let scheduler: BackgroundScheduler;

    beforeEach(() => {
        vi.useFakeTimers();
        scheduler = new BackgroundScheduler();
    });

    afterEach(async () => {
        await scheduler.stop();
        vi.useRealTimers();
    });

    // -- Start / Stop --

    it("is not running before start()", () => {
        expect(scheduler.isRunning()).toBe(false);
    });

    it("is running after start()", async () => {
        await scheduler.start();
        expect(scheduler.isRunning()).toBe(true);
    });

    it("is not running after stop()", async () => {
        await scheduler.start();
        await scheduler.stop();
        expect(scheduler.isRunning()).toBe(false);
    });

    // -- Schedule / Execute --

    it("executes a scheduled task at the given interval", async () => {
        await scheduler.start();
        const task = vi.fn().mockResolvedValue(undefined);
        scheduler.schedule("heartbeat", task, 1000);

        vi.advanceTimersByTime(1000);
        await Promise.resolve();

        expect(task).toHaveBeenCalledOnce();

        vi.advanceTimersByTime(1000);
        await Promise.resolve();

        expect(task).toHaveBeenCalledTimes(2);
    });

    it("does not execute a task when scheduler is stopped", async () => {
        await scheduler.start();
        const task = vi.fn().mockResolvedValue(undefined);
        scheduler.schedule("heartbeat", task, 1000);
        await scheduler.stop();

        vi.advanceTimersByTime(2000);
        await Promise.resolve();

        expect(task).not.toHaveBeenCalled();
    });

    // -- Cancel --

    it("cancel stops a specific task without stopping the scheduler", async () => {
        await scheduler.start();
        const task = vi.fn().mockResolvedValue(undefined);
        scheduler.schedule("heartbeat", task, 1000);
        scheduler.cancel("heartbeat");

        vi.advanceTimersByTime(2000);
        await Promise.resolve();

        expect(task).not.toHaveBeenCalled();
        expect(scheduler.isRunning()).toBe(true);
    });

    it("cancel is a no-op for an unknown task name", async () => {
        await scheduler.start();
        expect(() => scheduler.cancel("nonexistent")).not.toThrow();
    });

    // -- Re-schedule --

    it("re-scheduling an existing task replaces the previous timer", async () => {
        await scheduler.start();
        const task = vi.fn().mockResolvedValue(undefined);
        scheduler.schedule("heartbeat", task, 1000);
        scheduler.schedule("heartbeat", task, 5000);

        vi.advanceTimersByTime(1000);
        await Promise.resolve();

        expect(task).not.toHaveBeenCalled();

        vi.advanceTimersByTime(4000);
        await Promise.resolve();

        expect(task).toHaveBeenCalledOnce();
    });

});
