/**
 * Nova X AI
 * AI Router
 * Unit tests: CircuitBreaker
 */
import { describe, it, expect } from "vitest";
import { CircuitBreaker, CircuitState } from "../../src/Domain/Services/CircuitBreaker";

describe("CircuitBreaker", () => {

    it("starts Closed", () => {
        const cb = new CircuitBreaker();
        expect(cb.getState()).toBe(CircuitState.Closed);
        expect(cb.canExecute()).toBe(true);
        expect(cb.getFailureCount()).toBe(0);
    });

    it("transitions to HalfOpen after failure threshold", () => {
        const cb = new CircuitBreaker({
            failureThreshold: 3,
            recoveryTimeoutMs: 1000,
            halfOpenAttempts: 2
        });

        cb.recordFailure("fail1");
        expect(cb.getState()).toBe(CircuitState.HalfOpen);

        cb.recordFailure("fail2");
        expect(cb.getState()).toBe(CircuitState.HalfOpen);

        cb.recordFailure("fail3");
        expect(cb.getState()).toBe(CircuitState.Open);
        expect(cb.canExecute()).toBe(false);
    });

    it("allows execution after recovery timeout", () => {
        const cb = new CircuitBreaker({
            failureThreshold: 1,
            recoveryTimeoutMs: 50,
            halfOpenAttempts: 1
        });

        cb.recordFailure("fail");
        expect(cb.getState()).toBe(CircuitState.Open);
        expect(cb.canExecute()).toBe(false);

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                expect(cb.canExecute()).toBe(true);
                expect(cb.getState()).toBe(CircuitState.HalfOpen);
                resolve();
            }, 60);
        });
    });

    it("returns to Closed on success", () => {
        const cb = new CircuitBreaker({
            failureThreshold: 2,
            recoveryTimeoutMs: 1000,
            halfOpenAttempts: 1
        });

        cb.recordFailure("fail");
        expect(cb.getState()).toBe(CircuitState.HalfOpen);

        cb.recordSuccess();
        expect(cb.getState()).toBe(CircuitState.Closed);
        expect(cb.getFailureCount()).toBe(0);
    });

    it("respects halfOpenAttempts limit", () => {
        const cb = new CircuitBreaker({
            failureThreshold: 1,
            recoveryTimeoutMs: 10,
            halfOpenAttempts: 2
        });

        cb.recordFailure("fail");
        expect(cb.getState()).toBe(CircuitState.Open);

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                expect(cb.canExecute()).toBe(true);
                cb.recordFailure("fail2");
                expect(cb.getState()).toBe(CircuitState.Open);
                expect(cb.canExecute()).toBe(false);
                resolve();
            }, 20);
        });
    });

    it("resets state", () => {
        const cb = new CircuitBreaker({
            failureThreshold: 2
        });
        cb.recordFailure("fail");
        cb.recordFailure("fail");
        cb.recordFailure("fail");
        expect(cb.getState()).toBe(CircuitState.Open);

        cb.reset();
        expect(cb.getState()).toBe(CircuitState.Closed);
        expect(cb.getFailureCount()).toBe(0);
    });

    it("trips the circuit", () => {
        const cb = new CircuitBreaker({
            failureThreshold: 1
        });
        cb.recordFailure("fail");
        cb.trip();
        expect(cb.getState()).toBe(CircuitState.Open);
        expect(cb.isTripRequired()).toBe(true);
    });

});
