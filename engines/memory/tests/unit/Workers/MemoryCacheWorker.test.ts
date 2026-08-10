import { describe, it, expect } from "vitest";
import { MemoryCacheWorker } from "../../../src/Infrastructure/Workers/MemoryCacheWorker";

describe("MemoryCacheWorker", () => {
    it("should start and stop", async () => {
        const worker = new MemoryCacheWorker();
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        expect(worker.getWorkerName()).toBe("MemoryCacheWorker");
        await worker.stop();
        expect(worker.isRunning()).toBe(false);
    });
});
