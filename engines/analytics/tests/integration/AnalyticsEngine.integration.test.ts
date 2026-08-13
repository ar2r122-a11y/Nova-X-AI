import { describe, it, expect, beforeEach } from "vitest";
import { EventBus } from "@nova-x-ai/core";
import { AnalyticsEngine } from "../../src/Infrastructure/AnalyticsEngine";
import { MetricType } from "../../src/Domain/ValueObjects/MetricType";
import { AnalyticsSettings } from "../../src/Domain/Entities/AnalyticsSettings";

const createFakeMetricRepository = () => {
    const store = new Map<string, any>();
    return {
        save: async (metric: any) => { store.set(metric.getId().getValue(), metric); },
        getById: async (id: string) => store.get(id) ?? null,
        getAll: async () => Array.from(store.values()),
        getByType: async () => Array.from(store.values()),
        getByFeature: async () => Array.from(store.values()),
        getByPerformance: async () => Array.from(store.values()),
        getByTimeRange: async () => Array.from(store.values()),
        delete: async () => {},
        exists: async () => false,
        deleteExpired: async () => 0
    };
};

const createFakeTelemetryRepository = () => {
    const store = new Map<string, any>();
    return {
        save: async (event: any) => { store.set(event.getId().getValue(), event); },
        getById: async (id: string) => store.get(id) ?? null,
        getAll: async () => Array.from(store.values()),
        getByType: async () => Array.from(store.values()),
        getByTimeRange: async () => Array.from(store.values()),
        delete: async () => {},
        deleteExpired: async () => 0
    };
};

const createFakeSettingsRepository = () => {
    const settings = AnalyticsSettings.create();
    return {
        getSettings: async () => settings,
        saveSettings: async () => {}
    };
};

describe("AnalyticsEngine Integration", () => {
    let eventBus: EventBus;
    let engine: AnalyticsEngine;

    beforeEach(() => {
        eventBus = new EventBus(1000);
        engine = new AnalyticsEngine(
            eventBus,
            createFakeMetricRepository(),
            createFakeTelemetryRepository(),
            createFakeSettingsRepository()
        );
    });

    it("should record a metric", async () => {
        const result = await engine.recordMetric({
            type: MetricType.FeatureUsage,
            name: "chat_send",
            value: 1,
            unit: "count",
            tags: ["conversation"],
            featureTag: "chat",
            engineSource: "conversation"
        });
        expect(result).toBeDefined();
        expect(result.accepted).toBe(true);
    });

    it("should record a telemetry event", async () => {
        const result = await engine.recordTelemetryEvent({
            eventType: "REQ_CONV_PostMessageCommand",
            payload: { message: "hello" },
            engineSource: "conversation"
        });
        expect(result).toBeDefined();
        expect(result.accepted).toBe(true);
    });

    it("should retrieve metrics", async () => {
        await engine.recordMetric({
            type: MetricType.Performance,
            name: "api_latency",
            value: 150,
            unit: "ms",
            tags: ["api"],
            performanceTag: "latency"
        });

        const metrics = await engine.getMetrics({
            metricType: MetricType.Performance,
            limit: 10,
            requesterId: "owner-1"
        });
        expect(metrics.length).toBeGreaterThanOrEqual(1);
    });

    it("should return analytics settings", async () => {
        const settings = await engine.getSettings({ requesterId: "owner-1" });
        expect(settings).toBeDefined();
        expect(settings.optedOut).toBe(false);
    });

    it("should update privacy settings", async () => {
        const settings = await engine.updatePrivacySettings({
            piiStrippingEnabled: false,
            promptTextHashingEnabled: true,
            ipAnonymizationEnabled: true,
            claims: { roles: ["admin"], permissions: ["write"] }
        });
        expect(settings.piiStrippingEnabled).toBe(false);
    });

    it("should set opt-out", async () => {
        const settings = await engine.setOptOut({
            optedOut: true,
            claims: { roles: ["admin"], permissions: ["write"] }
        });
        expect(settings.optedOut).toBe(true);
    });

    it("should purge old data", async () => {
        const result = await engine.purge({
            olderThanDays: 30,
            claims: { roles: ["admin"], permissions: ["write"] }
        });
        expect(result).toBeDefined();
        expect(result.executedAt).toBeGreaterThan(0);
    });
});
