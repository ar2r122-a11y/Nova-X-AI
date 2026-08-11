import { describe, test, expect, vi } from "vitest";
import { RuntimeState } from "../../../src/Domain/ValueObjects/RuntimeState";
import { StoryRuntimeExecutionContext } from "../../../src/Application/Services/StoryRuntimeExecutionContext";

describe("StoryRuntimeExecutionContext", () => {
    test("tracks activity and uptime", () => {
        const context = new StoryRuntimeExecutionContext("story-1", "corr-1");
        expect(context.state).toBe(RuntimeState.Initializing);
        expect(context.getUptime()).toBeGreaterThanOrEqual(0);

        context.updateActivity();
        expect(context.isIdle(0)).toBe(false);
    });

    test("cancels operations", () => {
        const context = new StoryRuntimeExecutionContext("story-1", "corr-1");
        let cancelled = false;
        context.registerCancellation("op-1", () => {
            cancelled = true;
        });
        context.cancel("op-1");
        expect(cancelled).toBe(true);
    });

    test("cancels all operations", () => {
        const context = new StoryRuntimeExecutionContext("story-1", "corr-1");
        let cancelled = false;
        context.registerCancellation("op-1", () => {
            cancelled = true;
        });
        context.cancelAll();
        expect(cancelled).toBe(true);
    });
});
