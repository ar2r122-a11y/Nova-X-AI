/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HealthProbe } from "../../../src/Infrastructure/HealthProbe";

describe("HealthProbe", () => {
    it("should report healthy when all probes return true", async () => {
        const probe = new HealthProbe("test");
        probe.register({
            engineName: "core",
            check: async () => ({ healthy: true, durationMs: 0 })
        });
        probe.register({
            engineName: "analytics",
            check: async () => ({ healthy: true, durationMs: 0 })
        });

        const result = await probe.check();
        expect(result.healthy).toBe(true);
        expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });

    it("should report unhealthy when any probe returns false", async () => {
        const probe = new HealthProbe("test");
        probe.register({
            engineName: "core",
            check: async () => ({ healthy: true, durationMs: 0 })
        });
        probe.register({
            engineName: "analytics",
            check: async () => ({ healthy: false, durationMs: 0 })
        });

        const result = await probe.check();
        expect(result.healthy).toBe(false);
    });

    it("should report unhealthy when a probe throws", async () => {
        const probe = new HealthProbe("test");
        probe.register({
            engineName: "core",
            check: async () => {
                throw new Error("Connection failed");
            }
        });

        const result = await probe.check();
        expect(result.healthy).toBe(false);
        expect(result.message).toBe("Connection failed");
    });

    it("should return probeAll results", async () => {
        const probe = new HealthProbe("test");
        probe.register({
            engineName: "core",
            check: async () => ({ healthy: true, durationMs: 0 })
        });
        probe.register({
            engineName: "analytics",
            check: async () => ({ healthy: false, durationMs: 0, message: "timeout" })
        });

        const results = await probe.probeAll();
        expect(results).toHaveLength(2);
        expect(results[0].engineName).toBe("core");
        expect(results[0].healthy).toBe(true);
        expect(results[1].engineName).toBe("analytics");
        expect(results[1].healthy).toBe(false);
        expect(results[1].message).toBe("timeout");
    });
});
