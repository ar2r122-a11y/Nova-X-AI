import { describe, it, expect } from "vitest";
import { SchedulerWorker } from "../../../src/Infrastructure/Workers/SchedulerWorker";
import type { ISchedulerWorker } from "../../../src/Contracts/ISchedulerWorker";

describe("ISchedulerWorker", () => {
    it("SchedulerWorker implements ISchedulerWorker", () => {
        const worker = new SchedulerWorker();
        expect(worker).toBeInstanceOf(SchedulerWorker);
        expect(worker.workerName).toBeDefined();
        expect(typeof worker.setEngine).toBe("function");
        expect(typeof worker.configure).toBe("function");
        expect(typeof worker.start).toBe("function");
        expect(typeof worker.stop).toBe("function");
        expect(typeof worker.pause).toBe("function");
        expect(typeof worker.resume).toBe("function");
        expect(typeof worker.isRunning).toBe("function");
        expect(typeof worker.getHealth).toBe("function");
        expect(typeof worker.schedule).toBe("function");
        expect(typeof worker.cancel).toBe("function");
    });
});
