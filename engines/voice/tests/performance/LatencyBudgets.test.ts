import { describe, it, expect, beforeEach } from "vitest";
import { VoiceBudgetAllocator } from "../../src/Infrastructure/Budget/VoiceBudgetAllocator";

describe("LatencyBudgets", () => {
    let allocator: VoiceBudgetAllocator;

    beforeEach(() => {
        allocator = new VoiceBudgetAllocator(200, 150, 64 * 1024 * 1024, 128, 2048, 4096);
    });

    it("allocates latency within soft budget (150ms)", () => {
        expect(allocator.allocateLatency(100)).toBe(true);
        expect(allocator.getUsedLatencyMs()).toBe(100);
    });

    it("allocates latency within hard budget (200ms)", () => {
        expect(allocator.allocateLatency(180)).toBe(true);
        expect(allocator.getUsedLatencyMs()).toBe(180);
    });

    it("rejects latency exceeding hard budget (200ms)", () => {
        expect(allocator.allocateLatency(201)).toBe(false);
        expect(allocator.getUsedLatencyMs()).toBe(0);
    });

    it("soft warning at 150ms threshold", () => {
        expect(allocator.allocateLatency(150)).toBe(true);
        expect(allocator.getUsedLatencyMs()).toBe(150);
        expect(allocator.isLatencyExceeded()).toBe(false);
        expect(allocator.allocateLatency(50)).toBe(true);
        expect(allocator.getUsedLatencyMs()).toBe(200);
        expect(allocator.isLatencyExceeded()).toBe(false);
        expect(allocator.allocateLatency(1)).toBe(false);
        expect(allocator.getUsedLatencyMs()).toBe(200);
    });

    it("hard budget exceeded at 200ms", () => {
        expect(allocator.allocateLatency(200)).toBe(true);
        expect(allocator.getUsedLatencyMs()).toBe(200);
        expect(allocator.isLatencyExceeded()).toBe(false);
        expect(allocator.allocateLatency(1)).toBe(false);
        expect(allocator.getUsedLatencyMs()).toBe(200);
    });

    it("releases latency correctly", () => {
        allocator.allocateLatency(100);
        allocator.releaseLatency(50);
        expect(allocator.getUsedLatencyMs()).toBe(50);
    });

    it("does not release below zero", () => {
        allocator.releaseLatency(100);
        expect(allocator.getUsedLatencyMs()).toBe(0);
    });
});
