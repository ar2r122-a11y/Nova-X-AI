import { describe, it, expect } from "vitest";
import { ProviderHealthDto } from "../../../src/Application/DTO/ProviderHealthDto";

describe("ProviderHealthDto", () => {
    it("creates with all properties", () => {
        const dto = new ProviderHealthDto("provider-1", "healthy", 120, 1700000000000, 2, 98);
        expect(dto.providerId).toBe("provider-1");
        expect(dto.status).toBe("healthy");
        expect(dto.latencyMs).toBe(120);
        expect(dto.lastChecked).toBe(1700000000000);
        expect(dto.errorCount).toBe(2);
        expect(dto.successCount).toBe(98);
    });

    it("creates with unhealthy status", () => {
        const dto = new ProviderHealthDto("provider-1", "unhealthy", 5000, 1700000000000, 50, 0);
        expect(dto.status).toBe("unhealthy");
        expect(dto.errorCount).toBe(50);
        expect(dto.successCount).toBe(0);
    });

    it("creates with zero latency", () => {
        const dto = new ProviderHealthDto("provider-1", "healthy", 0, 1700000000000, 0, 100);
        expect(dto.latencyMs).toBe(0);
    });
});
