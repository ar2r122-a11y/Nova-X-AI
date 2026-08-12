import { describe, it, expect } from "vitest";
import type { IProviderHealthCheck, HealthCheckReport } from "../../../src/Contracts/IProviderHealthCheck";
import type { RuntimeHealthStatus } from "../../../src/Contracts/Runtime";

describe("IProviderHealthCheck", () => {
    it("IProviderHealthCheck has required readonly fields", () => {
        const runtimeStatus: RuntimeHealthStatus = {
            status: "healthy",
            runtimeState: "running",
            uptimeMs: 100,
            workers: [],
            checks: [],
            timestamp: Date.now()
        };
        const check: IProviderHealthCheck = {
            providerId: "default",
            status: runtimeStatus,
            latencyMs: 120,
            lastChecked: Date.now(),
            errorCount: 0,
            successCount: 42
        };
        expect(check.providerId).toBe("default");
        expect(check.status.status).toBe("healthy");
        expect(check.latencyMs).toBe(120);
        expect(check.errorCount).toBe(0);
        expect(check.successCount).toBe(42);
    });

    it("HealthCheckReport has required fields", () => {
        const report: HealthCheckReport = {
            name: "provider-check",
            healthy: true,
            durationMs: 50
        };
        expect(report.name).toBe("provider-check");
        expect(report.healthy).toBe(true);
        expect(report.durationMs).toBe(50);
    });

    it("HealthCheckReport supports optional message", () => {
        const report: HealthCheckReport = {
            name: "provider-check",
            healthy: false,
            message: "connection timeout",
            durationMs: 5000
        };
        expect(report.healthy).toBe(false);
        expect(report.message).toBe("connection timeout");
    });
});
