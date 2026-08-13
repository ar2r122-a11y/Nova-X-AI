import { describe, it, expect } from "vitest";
import { MetricAggregationService } from "../../../src/Domain/Services/MetricAggregationService";
import { Metric } from "../../../src/Domain/Entities/Metric";
import { MetricType } from "../../../src/Domain/ValueObjects/MetricType";
import { MetricValue } from "../../../src/Domain/ValueObjects/MetricValue";
import { FeatureTag } from "../../../src/Domain/ValueObjects/FeatureTag";
import { PerformanceTag } from "../../../src/Domain/ValueObjects/PerformanceTag";
import { PIIMask } from "../../../src/Domain/ValueObjects/PIIMask";

describe("MetricAggregationService", () => {
    const createMetric = (type: MetricType, name: string, value: number, feature?: string, performance?: string): Metric => {
        return Metric.create({
            type,
            name,
            value: MetricValue.create(value, "unit"),
            tags: [],
            featureTag: feature ? FeatureTag.create(feature) : undefined,
            performanceTag: performance ? PerformanceTag.create(performance) : undefined,
            piiMask: PIIMask.none()
        });
    };

    it("should aggregate feature usage", () => {
        const service = new MetricAggregationService();
        const metrics = [
            createMetric(MetricType.FeatureUsage, "use1", 1, "chat"),
            createMetric(MetricType.FeatureUsage, "use2", 2, "chat"),
            createMetric(MetricType.FeatureUsage, "use3", 3, "image")
        ];

        const result = service.aggregateByFeature(metrics);
        expect(result.get("chat")?.count).toBe(2);
        expect(result.get("image")?.count).toBe(1);
    });

    it("should aggregate performance metrics", () => {
        const service = new MetricAggregationService();
        const metrics = [
            createMetric(MetricType.Performance, "p1", 100, undefined, "latency"),
            createMetric(MetricType.Performance, "p2", 200, undefined, "latency"),
            createMetric(MetricType.Performance, "p3", 50, undefined, "throughput")
        ];

        const result = service.aggregatePerformance(metrics);
        expect(result.get("latency")?.count).toBe(2);
        expect(result.get("latency")?.avgValue).toBeCloseTo(150);
        expect(result.get("latency")?.maxValue).toBe(200);
    });
});
