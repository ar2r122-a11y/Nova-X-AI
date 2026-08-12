import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceBudgetAllocator } from "../../../src/Infrastructure/Budget/VoiceBudgetAllocator";

describe("LatencyBudget (VoiceBudgetAllocator)", () => {
    let allocator: VoiceBudgetAllocator;

    beforeEach(() => {
        allocator = new VoiceBudgetAllocator();
    });

    describe("defaults", () => {

        it("has 150ms soft latency by default", () => {
            expect(allocator.getSoftLatencyMs()).toBe(150);
        });

        it("has 200ms hard latency by default", () => {
            expect(allocator.getHardLatencyMs()).toBe(200);
        });

    });

    describe("allocateLatency", () => {

        it("allocates latency within hard budget", () => {
            expect(allocator.allocateLatency(100)).toBe(true);
            expect(allocator.getUsedLatencyMs()).toBe(100);
        });

        it("returns false when allocation exceeds hard budget", () => {
            allocator.allocateLatency(150);
            expect(allocator.allocateLatency(100)).toBe(false);
            expect(allocator.getUsedLatencyMs()).toBe(150);
        });

        it("returns false when allocation would exceed hard budget exactly", () => {
            allocator.allocateLatency(200);
            expect(allocator.allocateLatency(1)).toBe(false);
        });

    });

    describe("releaseLatency", () => {

        it("releases allocated latency", () => {
            allocator.allocateLatency(100);
            allocator.releaseLatency(30);
            expect(allocator.getUsedLatencyMs()).toBe(70);
        });

        it("does not release below zero", () => {
            allocator.allocateLatency(50);
            allocator.releaseLatency(100);
            expect(allocator.getUsedLatencyMs()).toBe(0);
        });

    });

    describe("isLatencyExceeded", () => {

        it("returns false when under hard budget", () => {
            allocator.allocateLatency(100);
            expect(allocator.isLatencyExceeded()).toBe(false);
        });

        it("returns false when at exactly the hard budget", () => {
            allocator.allocateLatency(200);
            expect(allocator.isLatencyExceeded()).toBe(false);
        });

    });

    describe("custom budgets", () => {

        it("accepts custom hard and soft latency values", () => {
            const custom = new VoiceBudgetAllocator(500, 300);
            expect(custom.getHardLatencyMs()).toBe(500);
            expect(custom.getSoftLatencyMs()).toBe(300);
        });

    });

});
