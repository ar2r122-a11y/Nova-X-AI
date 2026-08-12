import { describe, it, expect, vi, beforeEach } from "vitest";
import { SequencingManager } from "../../../src/Infrastructure/MultiSpeaker";

describe("SequencingManager", () => {
    let manager: SequencingManager;

    beforeEach(() => {
        manager = new SequencingManager();
    });

    describe("next", () => {

        it("returns 0 on first call", () => {
            expect(manager.next()).toBe(0);
        });

        it("increments sequence on each call", () => {
            expect(manager.next()).toBe(0);
            expect(manager.next()).toBe(1);
            expect(manager.next()).toBe(2);
        });

        it("returns monotonically increasing values", () => {
            const values = [manager.next(), manager.next(), manager.next(), manager.next()];
            expect(values).toEqual([0, 1, 2, 3]);
        });

    });

    describe("reset", () => {

        it("resets sequence to 0", () => {
            manager.next();
            manager.next();
            manager.reset();
            expect(manager.next()).toBe(0);
        });

        it("allows sequence to start over after reset", () => {
            manager.next();
            manager.next();
            manager.reset();
            expect(manager.next()).toBe(0);
            expect(manager.next()).toBe(1);
        });

    });

});
