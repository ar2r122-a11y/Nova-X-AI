import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ProviderTimeoutHandler } from "../../../src/Infrastructure/Provider";

describe("ProviderTimeoutHandler", () => {
    let handler: ProviderTimeoutHandler;

    beforeEach(() => {
        vi.useFakeTimers();
        handler = new ProviderTimeoutHandler();
    });

    afterEach(() => {
        handler.clearAll();
        vi.useRealTimers();
    });

    describe("set", () => {

        it("registers a timeout for a streamId", () => {
            const onTimeout = vi.fn();
            handler.set("stream-1", 1000, onTimeout);
            expect(vi.getTimerCount()).toBeGreaterThan(0);
        });

        it("calls onTimeout after the specified duration", () => {
            const onTimeout = vi.fn();
            handler.set("stream-1", 1000, onTimeout);
            vi.advanceTimersByTime(1000);
            expect(onTimeout).toHaveBeenCalledTimes(1);
        });

    });

    describe("clear", () => {

        it("prevents timeout from firing when cleared", () => {
            const onTimeout = vi.fn();
            handler.set("stream-1", 1000, onTimeout);
            handler.clear("stream-1");
            vi.advanceTimersByTime(1000);
            expect(onTimeout).not.toHaveBeenCalled();
        });

        it("does nothing when clearing a non-existent streamId", () => {
            expect(() => handler.clear("non-existent")).not.toThrow();
        });

    });

    describe("clearAll", () => {

        it("clears all registered timeouts", () => {
            const onTimeout1 = vi.fn();
            const onTimeout2 = vi.fn();
            handler.set("stream-1", 1000, onTimeout1);
            handler.set("stream-2", 1000, onTimeout2);
            handler.clearAll();
            vi.advanceTimersByTime(1000);
            expect(onTimeout1).not.toHaveBeenCalled();
            expect(onTimeout2).not.toHaveBeenCalled();
        });

    });

});
