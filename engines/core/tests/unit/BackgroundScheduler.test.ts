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

    // -- Worker Pool --

    it("respects maxWorkers concurrency limit", async () => {
        vi.useFakeTimers();
        const pool = new BackgroundScheduler(2);
        await pool.start();

        let active = 0;
        let maxActive = 0;

        const task = vi.fn().mockImplementation(async () => {
            active++;
            maxActive = Math.max(maxActive, active);
            await new Promise(resolve => setTimeout(resolve, 1000));
            active--;
        });

        pool.schedule("heartbeat", task, 100);

        vi.advanceTimersByTime(100);
        await Promise.resolve();
        expect(maxActive).toBe(1);

        vi.advanceTimersByTime(100);
        await Promise.resolve();
        expect(maxActive).toBe(2);

        vi.advanceTimersByTime(100);
        await Promise.resolve();
        expect(maxActive).toBe(2);

        pool.stop();
        vi.useRealTimers();
    });

    it("isolates failures in scheduled tasks", async () => {
        await scheduler.start();
        const failing = vi.fn().mockRejectedValue(new Error("task failure"));
        const succeeding = vi.fn().mockResolvedValue(undefined);

        scheduler.schedule("fail", failing, 1000);
        scheduler.schedule("success", succeeding, 1000);

        vi.advanceTimersByTime(1000);
        await Promise.resolve();

        expect(failing).toHaveBeenCalledOnce();
        expect(succeeding).toHaveBeenCalledOnce();
    });

    it("drains in-flight tasks on stop", async () => {
        vi.useRealTimers();
        const pool = new BackgroundScheduler(1);
        await pool.start();

        let finished = false;
        const task = vi.fn().mockImplementation(async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
            finished = true;
        });

        pool.schedule("long", task, 10);

        await new Promise(resolve => setTimeout(resolve, 20));
        expect(task).toHaveBeenCalledTimes(1);
        expect(finished).toBe(false);

        await pool.stop();
        expect(finished).toBe(true);
    });

});
