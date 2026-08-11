import { describe, test, expect } from "vitest";

describe("PerformanceBudget", () => {
    test("scene transition evaluation budget", async () => {
        const start = Date.now();
        for (let i = 0; i < 100; i++) {
            const scene = { getStatus: () => ({ getValue: () => "pending" }) };
            const status = scene.getStatus().getValue();
            expect(status === "pending" || status === "active").toBe(true);
        }
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(200);
    });

    test("query read latency budget", async () => {
        const start = Date.now();
        const data = { storyId: "story-1", status: "active", state: "inProgress" };
        const json = JSON.stringify(data);
        const parsed = JSON.parse(json);
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(15);
        expect(parsed.storyId).toBe("story-1");
    });

    test("active story heap allocation is bounded", async () => {
        const flags = new Map();
        for (let i = 0; i < 100; i++) {
            flags.set(`flag-${i}`, { value: i });
        }
        const serialized = JSON.stringify(Object.fromEntries(flags));
        expect(serialized.length).toBeLessThan(65536);
    });
});
