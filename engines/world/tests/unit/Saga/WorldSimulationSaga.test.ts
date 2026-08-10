/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import { WorldSimulationSaga } from "../../../src/Infrastructure/Saga/WorldSimulationSaga";
import { IEventBus } from "@nova-x-ai/core";

describe("WorldSimulationSaga", () => {
    let mockEventBus: Mocked<IEventBus>;
    let saga: WorldSimulationSaga;

    beforeEach(() => {
        mockEventBus = {
            publish: vi.fn().mockResolvedValue(undefined),
            subscribe: vi.fn()
        } as unknown as Mocked<IEventBus>;
        saga = new WorldSimulationSaga(mockEventBus);
    });

    it("should start a new saga", async () => {
        await saga.start("world-1", "active");
        expect(saga.getProcessState()).toBe("running");
    });

    it("should not start a saga twice", async () => {
        await saga.start("world-1", "active");
        await saga.start("world-1", "active");
        expect(saga.getProcessState()).toBe("running");
    });

    it("should execute a step and publish event", async () => {
        await saga.start("world-1", "active");
        await saga.executeStep({
            stepId: "step-1",
            name: "AdvanceTime",
            action: { type: "AdvanceTime", payload: { seconds: 1 } },
            executed: false,
            compensated: false
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it("should compensate a step", async () => {
        await saga.start("world-1", "active");
        await saga.executeStep({
            stepId: "step-1",
            name: "AdvanceTime",
            action: { type: "AdvanceTime", payload: { seconds: 1 } },
            compensationAction: { type: "RollbackTime", payload: { seconds: 1 } },
            executed: true,
            compensated: false
        });
        await saga.compensate({
            stepId: "step-1",
            name: "AdvanceTime",
            action: { type: "AdvanceTime", payload: { seconds: 1 } },
            compensationAction: { type: "RollbackTime", payload: { seconds: 1 } },
            executed: true,
            compensated: false
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it("should complete successfully", async () => {
        await saga.start("world-1", "active");
        await saga.executeStep({
            stepId: "step-1",
            name: "AdvanceTime",
            action: { type: "AdvanceTime", payload: {} },
            executed: true,
            compensated: false
        });
        await saga.complete();
        expect(saga.getProcessState()).toBe("completed");
        const result = saga.getResult();
        expect(result.success).toBe(true);
    });

    it("should fail and compensate", async () => {
        await saga.start("world-1", "active");
        await saga.executeStep({
            stepId: "step-1",
            name: "AdvanceTime",
            action: { type: "AdvanceTime", payload: {} },
            compensationAction: { type: "RollbackTime", payload: {} },
            executed: true,
            compensated: false
        });
        await saga.fail("downstream failure");
        expect(saga.getProcessState()).toBe("failed");
        const result = saga.getResult();
        expect(result.compensatedSteps).toContain("step-1");
    });

    it("should handle failure without compensation", async () => {
        await saga.start("world-1", "active");
        await saga.fail("immediate failure");
        expect(saga.getProcessState()).toBe("failed");
    });

    it("should return correct saga result", async () => {
        await saga.start("world-1", "active");
        const result = saga.getResult();
        expect(result.sagaId).toBe(saga.sagaId);
        expect(result.state).toBe("running");
        expect(typeof result.timestamp).toBe("number");
    });
});
