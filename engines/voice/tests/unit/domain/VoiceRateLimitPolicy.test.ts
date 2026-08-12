import { describe, it, expect } from "vitest";
import { VoiceRateLimitPolicy } from "../../../src/Domain/Policies/VoiceRateLimitPolicy";

describe("VoiceRateLimitPolicy", () => {

    const now = Date.now();

    describe("canProceed", () => {

        it("returns true when under the rate limit", () => {
            const history = [now - 30000];
            expect(VoiceRateLimitPolicy.canProceed(history)).toBe(true);
        });

        it("returns false when at the rate limit", () => {
            const history = Array.from({ length: 20 }, () => now - 1000);
            expect(VoiceRateLimitPolicy.canProceed(history)).toBe(false);
        });

        it("returns true when all requests are older than one minute", () => {
            const history = [now - 120000, now - 130000];
            expect(VoiceRateLimitPolicy.canProceed(history)).toBe(true);
        });

    });

    describe("recordRequest", () => {

        it("adds the current timestamp to the history", () => {
            const policy = new VoiceRateLimitPolicy();
            const history: number[] = [];
            const updated = policy.recordRequest(history);
            expect(updated).toHaveLength(1);
            expect(updated[0]).toBeCloseTo(now, -3);
        });

        it("filters out requests older than one minute", () => {
            const policy = new VoiceRateLimitPolicy();
            const history = [now - 120000];
            const updated = policy.recordRequest(history);
            expect(updated).toHaveLength(1);
        });

    });

    describe("getRemainingRequests", () => {

        it("returns the remaining requests when under the limit", () => {
            const policy = new VoiceRateLimitPolicy();
            const history = [now - 30000];
            expect(policy.getRemainingRequests(history)).toBe(19);
        });

        it("returns 0 when at the limit", () => {
            const policy = new VoiceRateLimitPolicy();
            const history = Array.from({ length: 20 }, () => now - 1000);
            expect(policy.getRemainingRequests(history)).toBe(0);
        });

        it("returns max requests when history is empty", () => {
            const policy = new VoiceRateLimitPolicy();
            expect(policy.getRemainingRequests([])).toBe(20);
        });

    });

});
