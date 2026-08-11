import { describe, test, expect } from "vitest";
import { StoryTracing } from "../../../src/Infrastructure/Observability/StoryTracing";

describe("StoryTracing", () => {
    test("starts and ends trace", () => {
        const tracing = new StoryTracing();
        tracing.startTrace("operation-1", "corr-1");
        const duration = tracing.endTrace("corr-1");
        expect(typeof duration).toBe("number");
    });

    test("adds span", () => {
        const tracing = new StoryTracing();
        expect(() => tracing.addSpan("span-1", 10)).not.toThrow();
    });

    test("returns 0 for unknown trace", () => {
        const tracing = new StoryTracing();
        const duration = tracing.endTrace("unknown");
        expect(duration).toBe(0);
    });
});
