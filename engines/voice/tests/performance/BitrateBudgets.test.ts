import { describe, it, expect, beforeEach } from "vitest";
import { VoiceBudgetAllocator } from "../../src/Infrastructure/Budget/VoiceBudgetAllocator";

describe("BitrateBudgets", () => {
    let allocator: VoiceBudgetAllocator;

    beforeEach(() => {
        allocator = new VoiceBudgetAllocator(200, 150, 64 * 1024 * 1024, 128, 2048, 4096);
    });

    it("allocates bitrate within 128kbps budget", () => {
        expect(allocator.allocateBitrate(64)).toBe(true);
        expect(allocator.getUsedBitrateKbps()).toBe(64);
    });

    it("rejects bitrate exceeding 128kbps", () => {
        expect(allocator.allocateBitrate(129)).toBe(false);
        expect(allocator.getUsedBitrateKbps()).toBe(0);
    });

    it("releases bitrate correctly", () => {
        allocator.allocateBitrate(64);
        allocator.releaseBitrate(32);
        expect(allocator.getUsedBitrateKbps()).toBe(32);
    });
});
