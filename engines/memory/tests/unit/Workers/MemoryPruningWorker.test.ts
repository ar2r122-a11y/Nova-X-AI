import { describe, it, expect } from "vitest";
import { MemoryPruningWorker } from "../../../src/Infrastructure/Workers/MemoryPruningWorker";

describe("MemoryPruningWorker", () => {
    it("should start and stop", async () => {
        const worker = new MemoryPruningWorker();
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        expect(worker.getWorkerName()).toBe("MemoryPruningWorker");
        await worker.stop();
        expect(worker.isRunning()).toBe(false);
    });
});
