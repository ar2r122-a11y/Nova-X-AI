import { describe, it, expect, beforeEach } from "vitest";
import { VoiceBudgetAllocator } from "../../src/Infrastructure/Budget/VoiceBudgetAllocator";

describe("InputSizeBudgets", () => {
    let allocator: VoiceBudgetAllocator;

    beforeEach(() => {
        allocator = new VoiceBudgetAllocator(200, 150, 64 * 1024 * 1024, 128, 2048, 4096);
    });

    it("enforces max input characters of 2048", () => {
        expect(allocator.getMaxInputCharacters()).toBe(2048);
    });

    it("enforces chunk size of 4096 bytes", () => {
        expect(allocator.getChunkSizeBytes()).toBe(4096);
    });
});
