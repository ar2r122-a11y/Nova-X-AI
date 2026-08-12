import { describe, it, expect, beforeEach } from "vitest";
import { VoiceBudgetAllocator } from "../../src/Infrastructure/Budget/VoiceBudgetAllocator";

describe("BufferBudgets", () => {
    let allocator: VoiceBudgetAllocator;

    beforeEach(() => {
        allocator = new VoiceBudgetAllocator(200, 150, 64 * 1024 * 1024, 128, 2048, 4096);
    });

    it("allocates buffer within 64MB budget", () => {
        const bytes = 32 * 1024 * 1024;
        expect(allocator.allocateBuffer(bytes)).toBe(true);
        expect(allocator.getUsedRingBufferBytes()).toBe(bytes);
    });

    it("rejects buffer exceeding 64MB", () => {
        const bytes = 65 * 1024 * 1024;
        expect(allocator.allocateBuffer(bytes)).toBe(false);
        expect(allocator.getUsedRingBufferBytes()).toBe(0);
    });

    it("releases buffer correctly", () => {
        allocator.allocateBuffer(1024);
        allocator.releaseBuffer(512);
        expect(allocator.getUsedRingBufferBytes()).toBe(512);
    });
});
