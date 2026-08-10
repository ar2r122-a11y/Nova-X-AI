import { describe, it, expect } from "vitest";
import { MemoryConsolidationWorker } from "../../../src/Infrastructure/Workers/MemoryConsolidationWorker";

describe("MemoryConsolidationWorker", () => {
    it("should start and stop", async () => {
        const worker = new MemoryConsolidationWorker();
        await worker.start();
        expect(worker.isRunning()).toBe(true);
        expect(worker.getWorkerName()).toBe("MemoryConsolidationWorker");
        await worker.stop();
        expect(worker.isRunning()).toBe(false);
    });
});
