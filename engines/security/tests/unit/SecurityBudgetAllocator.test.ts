import { describe, it, expect } from "vitest";
import { SecurityBudgetAllocator } from "../../src/Infrastructure/Budget/SecurityBudgetAllocator";
import { SecurityBudgetDto } from "../../src/Application/DTO";

describe("SecurityBudgetAllocator", () => {
    it("should create default budget", () => {
        const budget = SecurityBudgetDto.create();
        const allocator = new SecurityBudgetAllocator(budget);
        expect(allocator.getBudget()).toEqual(budget);
    });

    it("should allow crypto ops within budget", () => {
        const budget = SecurityBudgetDto.create(64, 3, 5, 16);
        const allocator = new SecurityBudgetAllocator(budget);

        const result1 = allocator.checkCryptoBudget();
        expect(result1.allowed).toBe(true);

        const result2 = allocator.checkCryptoBudget();
        expect(result2.allowed).toBe(true);
    });

    it("should deny crypto ops exceeding budget", () => {
        const budget = SecurityBudgetDto.create(64, 3, 2, 16);
        const allocator = new SecurityBudgetAllocator(budget);

        allocator.checkCryptoBudget();
        allocator.checkCryptoBudget();
        const result = allocator.checkCryptoBudget();
        expect(result.allowed).toBe(false);
        expect(result.reason).toBe("crypto_budget_exceeded");
    });

    it("should allow token cache within limit", () => {
        const budget = SecurityBudgetDto.create(64, 3, 200, 1);
        const allocator = new SecurityBudgetAllocator(budget);

        const result = allocator.checkTokenCache(500000);
        expect(result.allowed).toBe(true);
    });

    it("should deny token cache exceeding limit", () => {
        const budget = SecurityBudgetDto.create(64, 3, 200, 1);
        const allocator = new SecurityBudgetAllocator(budget);

        allocator.checkTokenCache(2 * 1024 * 1024);
        const result = allocator.checkTokenCache(1);
        expect(result.allowed).toBe(false);
        expect(result.reason).toBe("token_cache_limit_exceeded");
    });

    it("should reset token cache", () => {
        const budget = SecurityBudgetDto.create(64, 3, 200, 1);
        const allocator = new SecurityBudgetAllocator(budget);

        allocator.checkTokenCache(2 * 1024 * 1024);
        allocator.resetTokenCache();
        const result = allocator.checkTokenCache(500000);
        expect(result.allowed).toBe(true);
    });

    it("should update budget", () => {
        const budget1 = SecurityBudgetDto.create(64, 3, 200, 16);
        const allocator = new SecurityBudgetAllocator(budget1);
        const budget2 = SecurityBudgetDto.create(32, 2, 50, 8);
        allocator.updateBudget(budget2);
        expect(allocator.getBudget()).toEqual(budget2);
    });
});
