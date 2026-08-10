/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { WorldSimulationSaga } from "../../../src/Infrastructure/Saga/WorldSimulationSaga";
import { IEventBus } from "@nova-x-ai/core";

describe("Saga Performance", () => {
    let mockEventBus: Mocked<IEventBus>;
    let saga: WorldSimulationSaga;

    beforeEach(() => {
        mockEventBus = {
            publish: vi.fn().mockResolvedValue(undefined),
            subscribe: vi.fn()
        } as unknown as Mocked<IEventBus>;
        saga = new WorldSimulationSaga(mockEventBus);
    });

    it("should execute steps without blocking", async () => {
        await saga.start("world-1", "active");
        const start = Date.now();
        await saga.executeStep({
            stepId: "step-1",
            name: "AdvanceTime",
            action: { type: "AdvanceTime", payload: {} },
            executed: false,
            compensated: false
        });
        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(100);
    });

    it("should handle multiple steps", async () => {
        await saga.start("world-1", "active");
        for (let i = 0; i < 10; i++) {
            await saga.executeStep({
                stepId: `step-${i}`,
                name: `Step${i}`,
                action: { type: "Test", payload: {} },
                executed: false,
                compensated: false
            });
        }
        expect(saga.getProcessState()).toBe("running");
    });
});
