import { describe, it, expect } from "vitest";
import { MemoryDecayWorker } from "../../../src/Infrastructure/Workers/MemoryDecayWorker";

describe("MemoryDecayWorker", () => {
    it("should start and stop", async () => {
        const worker = new MemoryDecayWorker();
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        expect(worker.getWorkerName()).toBe("MemoryDecayWorker");
        await worker.stop();
        expect(worker.isRunning()).toBe(false);
    });

    it("should not start twice", async () => {
        const worker = new MemoryDecayWorker();
        await worker.start();
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        await worker.stop();
    });
});
