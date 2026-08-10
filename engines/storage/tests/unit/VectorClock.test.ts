import { describe, it, expect } from "vitest";
import { VectorClock } from "../../src/Domain/ValueObjects/index.ts";

describe("VectorClock", () => {
    it("should create empty clock", () => {
        const clock = VectorClock.create();
        expect(clock.getEntries()).toHaveLength(0);
    });

    it("should increment node", () => {
        const clock = VectorClock.create().increment("node-a");
        expect(clock.getEntries()).toHaveLength(1);
        expect(clock.getEntries()[0].nodeId).toBe("node-a");
        expect(clock.getEntries()[0].counter).toBe(1);
    });

    it("should merge clocks", () => {
        const a = VectorClock.create().increment("node-a");
        const b = VectorClock.create().increment("node-b");
        const merged = a.merge(b);
        expect(merged.getEntries()).toHaveLength(2);
    });

    it("should compare clocks", () => {
        const a = VectorClock.create().increment("node-a");
        const b = VectorClock.fromMap(new Map([["node-a", 2]]));
        expect(a.compare(b)).toBe("before");
        expect(b.compare(a)).toBe("after");
    });
});
