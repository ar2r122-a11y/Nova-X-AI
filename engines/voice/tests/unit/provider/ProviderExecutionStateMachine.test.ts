import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProviderExecutionStateMachine } from "../../../src/Infrastructure/Provider";

describe("ProviderExecutionStateMachine", () => {
    let machine: ProviderExecutionStateMachine;

    beforeEach(() => {
        machine = new ProviderExecutionStateMachine();
    });

    describe("initial state", () => {

        it("starts in idle state", () => {
            expect(machine.getState()).toBe("idle");
        });

    });

    describe("transition", () => {

        it("transitions from idle to invoking", () => {
            machine.transition("start");
            expect(machine.getState()).toBe("invoking");
        });

        it("transitions from invoking to streaming", () => {
            machine.transition("start");
            machine.transition("stream");
            expect(machine.getState()).toBe("streaming");
        });

        it("transitions from streaming to completed", () => {
            machine.transition("start");
            machine.transition("stream");
            machine.transition("complete");
            expect(machine.getState()).toBe("completed");
        });

        it("transitions from completed back to idle", () => {
            machine.transition("start");
            machine.transition("stream");
            machine.transition("complete");
            machine.transition("start");
            expect(machine.getState()).toBe("invoking");
        });

        it("transitions from invoking to failed", () => {
            machine.transition("start");
            machine.transition("fail");
            expect(machine.getState()).toBe("failed");
        });

        it("transitions from failed to retrying", () => {
            machine.transition("start");
            machine.transition("fail");
            machine.transition("retry");
            expect(machine.getState()).toBe("retrying");
        });

        it("transitions from retrying to invoking", () => {
            machine.transition("start");
            machine.transition("fail");
            machine.transition("retry");
            machine.transition("start");
            expect(machine.getState()).toBe("invoking");
        });

        it("transitions from failed back to idle", () => {
            machine.transition("start");
            machine.transition("fail");
            machine.transition("start");
            expect(machine.getState()).toBe("invoking");
        });

        it("transitions from streaming to retrying", () => {
            machine.transition("start");
            machine.transition("stream");
            machine.transition("retry");
            expect(machine.getState()).toBe("retrying");
        });

    });

    describe("invalid transitions", () => {

        it("throws when transitioning from idle to streaming", () => {
            expect(() => machine.transition("stream")).toThrow("Invalid state transition");
        });

        it("throws when transitioning from idle to completed", () => {
            expect(() => machine.transition("complete")).toThrow("Invalid state transition");
        });

        it("throws when transitioning from idle to failed", () => {
            expect(() => machine.transition("fail")).toThrow("Invalid state transition");
        });

        it("throws when transitioning from idle to retrying", () => {
            expect(() => machine.transition("retry")).toThrow("Invalid state transition");
        });

        it("throws when transitioning from invoking to completed", () => {
            machine.transition("start");
            expect(() => machine.transition("complete")).toThrow("Invalid state transition");
        });

        it("throws when transitioning from completed to streaming", () => {
            machine.transition("start");
            machine.transition("stream");
            machine.transition("complete");
            expect(() => machine.transition("stream")).toThrow("Invalid state transition");
        });

        it("throws when transitioning from retrying to completed", () => {
            machine.transition("start");
            machine.transition("fail");
            machine.transition("retry");
            expect(() => machine.transition("complete")).toThrow("Invalid state transition");
        });

    });

});
