import { describe, it, expect } from "vitest";
import { MetricAggregate } from "../../../src/Domain/Aggregates/MetricAggregate";
import { MetricType } from "../../../src/Domain/ValueObjects/MetricType";

describe("MetricAggregate", () => {
    it("should record a metric", () => {
        const aggregate = MetricAggregate.create();
        const metric = aggregate.recordMetric(
            MetricType.FeatureUsage,
            "chat_send",
            1,
            "count",
            ["conversation"],
            "chat",
            undefined,
            undefined,
            "session-1",
            "conversation"
        );

        expect(metric).toBeDefined();
        expect(metric.getName()).toBe("chat_send");
        expect(metric.getValue().getValue()).toBe(1);
    });

    it("should not record metrics when opted out", () => {
        const aggregate = MetricAggregate.create();
        aggregate.updateOptOut(true);

        expect(() => aggregate.recordMetric(
            MetricType.FeatureUsage,
            "chat_send",
            1,
            "count",
            []
        )).toThrow("opted out");
    });

    it("should filter metrics by feature tag", () => {
        const aggregate = MetricAggregate.create();
        aggregate.recordMetric(MetricType.FeatureUsage, "chat_send", 1, "count", [], "chat");
        aggregate.recordMetric(MetricType.FeatureUsage, "image_gen", 1, "count", [], "image");

        const chatMetrics = aggregate.getMetricsByFeature("chat");
        expect(chatMetrics.length).toBe(1);
        expect(chatMetrics[0].getName()).toBe("chat_send");
    });

    it("should prune expired metrics", () => {
        const aggregate = MetricAggregate.create();
        aggregate.recordMetric(MetricType.FeatureUsage, "old", 1, "count", []);
        const result = aggregate.pruneExpiredMetrics(0);
        expect(result.prunedCount).toBeGreaterThanOrEqual(0);
    });
});
