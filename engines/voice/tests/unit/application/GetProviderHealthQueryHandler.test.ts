import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetProviderHealthQueryHandler } from "../../../src/Application/Handlers/GetProviderHealthQueryHandler";
import { GetProviderHealthQuery } from "../../../src/Application/Queries/GetProviderHealthQuery";
import { ProviderHealthDto } from "../../../src/Application/DTO/ProviderHealthDto";

describe("GetProviderHealthQueryHandler", () => {
    let mockVoiceRepository: any;
    let handler: GetProviderHealthQueryHandler;

    beforeEach(() => {
        mockVoiceRepository = {};
        handler = new GetProviderHealthQueryHandler(mockVoiceRepository);
    });

    it("returns default healthy status when aggregate not found", async () => {
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(null);
        const query = new GetProviderHealthQuery("provider-1", "user-1");
        const result = await handler.handle(query);
        expect(result).toBeInstanceOf(ProviderHealthDto);
        expect(result.providerId).toBe("provider-1");
        expect(result.status).toBe("healthy");
        expect(result.latencyMs).toBe(0);
        expect(result.errorCount).toBe(0);
        expect(result.successCount).toBe(0);
    });

    it("returns unhealthy status when aggregate has consecutive failures", async () => {
        const aggregate = {
            getProviderId: () => ({ getValue: () => "provider-1" }),
            getConsecutiveFailures: () => 5
        };
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(aggregate);
        const query = new GetProviderHealthQuery("provider-1", "user-1");
        const result = await handler.handle(query);
        expect(result.status).toBe("unhealthy");
        expect(result.errorCount).toBe(5);
        expect(result.successCount).toBe(95);
    });

    it("returns healthy status when aggregate has no failures", async () => {
        const aggregate = {
            getProviderId: () => ({ getValue: () => "provider-1" }),
            getConsecutiveFailures: () => 0
        };
        mockVoiceRepository.findById = vi.fn().mockResolvedValue(aggregate);
        const query = new GetProviderHealthQuery("provider-1", "user-1");
        const result = await handler.handle(query);
        expect(result.status).toBe("healthy");
        expect(result.errorCount).toBe(0);
        expect(result.successCount).toBe(100);
    });
});
