import { describe, it, expect } from "vitest";
import { SessionStreamingWorker } from "../../src/Infrastructure/Workers/SessionStreamingWorker";
import { TokenAccumulator } from "../../src/Infrastructure/Workers/TokenAccumulator";
import { IdentityChunkAssembler } from "../../src/Infrastructure/Workers/IdentityChunkAssembler";

describe("Security Workers", () => {
    describe("SessionStreamingWorker", () => {
        it("should start and stop", async () => {
            const worker = new SessionStreamingWorker();
            await worker.start();
            expect(worker.isRunning()).toBe(true);
            await worker.stop();
            expect(worker.isRunning()).toBe(false);
        });

        it("should return worker name", () => {
            const worker = new SessionStreamingWorker();
            expect(worker.getWorkerName()).toBe("SessionStreamingWorker");
        });
    });

    describe("TokenAccumulator", () => {
        it("should start and stop", async () => {
            const worker = new TokenAccumulator();
            await worker.start();
            expect(worker.isRunning()).toBe(true);
            await worker.stop();
            expect(worker.isRunning()).toBe(false);
        });

        it("should return worker name", () => {
            const worker = new TokenAccumulator();
            expect(worker.getWorkerName()).toBe("TokenAccumulator");
        });
    });

    describe("IdentityChunkAssembler", () => {
        it("should start and stop", async () => {
            const worker = new IdentityChunkAssembler();
            await worker.start();
            expect(worker.isRunning()).toBe(true);
            await worker.stop();
            expect(worker.isRunning()).toBe(false);
        });

        it("should return worker name", () => {
            const worker = new IdentityChunkAssembler();
            expect(worker.getWorkerName()).toBe("IdentityChunkAssembler");
        });
    });
});
