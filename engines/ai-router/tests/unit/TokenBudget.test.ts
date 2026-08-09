/**
 * Nova X AI
 * AI Router
 * Unit tests: TokenBudget
 */
import { describe, it, expect } from "vitest";
import { TokenBudget } from "../../src/Domain/ValueObjects/TokenBudget";

describe("TokenBudget", () => {

    it("constructs with defaults", () => {
        const budget = new TokenBudget(8192);
        expect(budget.maxTokens).toBe(8192);
        expect(budget.reservedTokens).toBe(1024);
        expect(budget.contextTokens).toBe(4096);
        expect(budget.availableTokens).toBe(7168);
        expect(budget.contextWindow).toBe(4096);
    });

    it("throws when maxTokens is zero or negative", () => {
        expect(() => new TokenBudget(0)).toThrow();
        expect(() => new TokenBudget(-1)).toThrow();
    });

    it("throws when reservedTokens is negative", () => {
        expect(() => new TokenBudget(100, -1)).toThrow();
    });

    it("throws when contextTokens is zero or negative", () => {
        expect(() => new TokenBudget(100, 0, 0)).toThrow();
        expect(() => new TokenBudget(100, 0, -1)).toThrow();
    });

    it("validates prompt tokens against context budget", () => {
        const budget = new TokenBudget(100, 0, 50);
        expect(() => budget.validate(51, 10)).toThrow(
            /exceed context budget/
        );
    });

    it("validates total tokens against max budget", () => {
        const budget = new TokenBudget(100);
        expect(() => budget.validate(50, 51)).toThrow(
            /exceed max budget/
        );
    });

    it("passes validation when tokens fit", () => {
        const budget = new TokenBudget(100);
        expect(() => budget.validate(30, 40)).not.toThrow();
    });

    it("canFit returns true when tokens fit", () => {
        const budget = new TokenBudget(100);
        expect(budget.canFit(30, 40)).toBe(true);
    });

    it("canFit returns false when tokens do not fit", () => {
        const budget = new TokenBudget(100);
        expect(budget.canFit(60, 50)).toBe(false);
    });

});
