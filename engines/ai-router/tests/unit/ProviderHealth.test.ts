/**
 * Nova X AI
 * AI Router
 * Unit tests: ProviderHealth
 */
import { describe, it, expect } from "vitest";
import { ProviderHealth, ProviderHealthStatus } from "../../src/Domain/ValueObjects/ProviderHealth";

describe("ProviderHealth", () => {

    it("defaults to Healthy", () => {
        const health = new ProviderHealth();
        expect(health.status).toBe(ProviderHealthStatus.Healthy);
        expect(health.consecutiveFailures).toBe(0);
        expect(health.lastError).toBeNull();
        expect(health.isHealthy()).toBe(true);
        expect(health.isDegraded()).toBe(false);
        expect(health.isUnhealthy()).toBe(false);
    });

    it("isHealthy returns false for Unhealthy", () => {
        const health = new ProviderHealth(
            ProviderHealthStatus.Unhealthy,
            3,
            "error"
        );
        expect(health.isHealthy()).toBe(false);
        expect(health.isUnhealthy()).toBe(true);
    });

    it("isDegraded returns true for Degraded", () => {
        const health = new ProviderHealth(
            ProviderHealthStatus.Degraded,
            1,
            "error"
        );
        expect(health.isDegraded()).toBe(true);
        expect(health.isHealthy()).toBe(true);
    });

    it("recordFailure transitions to Degraded then Unhealthy", () => {
        let health = new ProviderHealth();
        health = health.recordFailure("fail1");
        expect(health.status).toBe(ProviderHealthStatus.Degraded);
        expect(health.consecutiveFailures).toBe(1);

        health = health.recordFailure("fail2");
        expect(health.status).toBe(ProviderHealthStatus.Degraded);
        expect(health.consecutiveFailures).toBe(2);

        health = health.recordFailure("fail3");
        expect(health.status).toBe(ProviderHealthStatus.Unhealthy);
        expect(health.consecutiveFailures).toBe(3);
    });

    it("recordSuccess resets to Healthy", () => {
        const health = new ProviderHealth(
            ProviderHealthStatus.Degraded,
            2,
            "error"
        );
        const reset = health.recordSuccess();
        expect(reset.status).toBe(ProviderHealthStatus.Healthy);
        expect(reset.consecutiveFailures).toBe(0);
        expect(reset.lastError).toBeNull();
    });

    it("toDegraded changes status without resetting failures", () => {
        const health = new ProviderHealth(
            ProviderHealthStatus.Healthy,
            0,
            null
        );
        const degraded = health.toDegraded("slow");
        expect(degraded.status).toBe(ProviderHealthStatus.Degraded);
        expect(degraded.consecutiveFailures).toBe(0);
        expect(degraded.lastError).toBe("slow");
    });

});
