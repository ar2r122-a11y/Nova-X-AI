import { describe, it, expect } from "vitest";
import { ResourceAllocator } from "../../src/Domain/Services/ImageEngineServices";
import { ResourceBudget } from "../../src/Domain/ValueObjects/ResourceBudget";

describe("ResourceAllocation", () => {
    describe("VRAM budgeting", () => {
        it("should allocate within VRAM budget", () => {
            const allocator = new ResourceAllocator(8192, 16384);
            expect(allocator.allocate(1024, 0)).toBe(true);
            expect(allocator.getAvailableVRAM()).toBe(7168);
        });

        it("should deny over VRAM budget", () => {
            const allocator = new ResourceAllocator(1024, 2048);
            allocator.allocate(1024, 0);
            expect(allocator.allocate(1, 0)).toBe(false);
        });

        it("should release VRAM", () => {
            const allocator = new ResourceAllocator(8192, 16384);
            allocator.allocate(1024, 0);
            allocator.release(512, 0);
            expect(allocator.getAvailableVRAM()).toBe(7680);
        });
    });

    describe("memory budgeting", () => {
        it("should allocate within memory budget", () => {
            const allocator = new ResourceAllocator(8192, 16384);
            expect(allocator.allocate(0, 4096)).toBe(true);
            expect(allocator.getAvailableMemory()).toBe(12288);
        });

        it("should deny over memory budget", () => {
            const allocator = new ResourceAllocator(1024, 2048);
            allocator.allocate(0, 2048);
            expect(allocator.allocate(0, 1)).toBe(false);
        });

        it("should release memory", () => {
            const allocator = new ResourceAllocator(8192, 16384);
            allocator.allocate(0, 1024);
            expect(allocator.getAvailableMemory()).toBe(15360);
        });
    });

    describe("combined allocation", () => {
        it("should allocate both VRAM and memory", () => {
            const allocator = new ResourceAllocator(8192, 16384);
            expect(allocator.allocate(2048, 4096)).toBe(true);
            expect(allocator.getAvailableVRAM()).toBe(6144);
            expect(allocator.getAvailableMemory()).toBe(12288);
        });

        it("should deny if either resource exceeds", () => {
            const allocator = new ResourceAllocator(1024, 2048);
            allocator.allocate(500, 1500);
            expect(allocator.allocate(600, 0)).toBe(false);
            expect(allocator.allocate(0, 600)).toBe(false);
        });
    });

    describe("ResourceBudget exhaustion", () => {
        it("should detect VRAM exhaustion", () => {
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            budget.consume(1000, 0, 0);
            expect(budget.isExhausted()).toBe(true);
            expect(budget.getRemainingVRAM()).toBe(0);
        });

        it("should detect memory exhaustion", () => {
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            budget.consume(0, 2000, 0);
            expect(budget.isExhausted()).toBe(true);
            expect(budget.getRemainingMemory()).toBe(0);
        });

        it("should detect time exhaustion", () => {
            const budget = ResourceBudget.create(1000, 2000, 5000, 1024);
            budget.consume(0, 0, 5000);
            expect(budget.isExhausted()).toBe(true);
            expect(budget.getRemainingTimeMs()).toBe(0);
        });
    });
});
