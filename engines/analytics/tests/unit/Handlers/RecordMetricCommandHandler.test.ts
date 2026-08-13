import { describe, it, expect, vi } from "vitest";
import { RecordMetricCommandHandler } from "../../../src/Application/Handlers/RecordMetricCommandHandler";
import { RecordMetricCommand } from "../../../src/Application/Commands/RecordMetricCommand";
import { MetricType } from "../../../src/Domain/ValueObjects/MetricType";

describe("RecordMetricCommandHandler", () => {
    it("should record a metric when analytics is not opted out", async () => {
        const publishFn = vi.fn(async () => {});
        const handler = new RecordMetricCommandHandler(
            { publish: publishFn } as any,
            {
                save: async () => {},
                getById: async () => null,
                getAll: async () => [],
                getByType: async () => [],
                getByFeature: async () => [],
                getByPerformance: async () => [],
                getByTimeRange: async () => [],
                delete: async () => {},
                exists: async () => false,
                deleteExpired: async () => 0
            } as any,
            {
                getSettings: async () => ({
                    getOptOutStatus: () => ({ isOptedOut: () => false }),
                    getRetentionPeriod: () => ({ getRawRetentionMs: () => 0, getSummaryRetentionMs: () => 0 }),
                    isPIIStrippingEnabled: () => true,
                    isPromptTextHashingEnabled: () => true,
                    isIPAnonymizationEnabled: () => true,
                    toSnapshot: () => ({})
                })
            } as any
        );

        const command = new RecordMetricCommand(
            MetricType.FeatureUsage,
            "chat_send",
            1,
            "count",
            ["conversation"],
            "chat",
            undefined,
            "session-1",
            "conversation"
        );

        const result = await handler.handle(command);
        expect(result).toBeDefined();
        expect(result.accepted).toBe(true);
    });

    it("should throw when analytics is opted out", async () => {
        const handler = new RecordMetricCommandHandler(
            {} as any,
            {} as any,
            {
                getSettings: async () => ({
                    getOptOutStatus: () => ({ isOptedOut: () => true }),
                    toSnapshot: () => ({})
                })
            } as any
        );

        const command = new RecordMetricCommand(
            MetricType.FeatureUsage,
            "chat_send",
            1,
            "count",
            [],
            "chat"
        );

        await expect(handler.handle(command)).rejects.toThrow("opted out");
    });
});
