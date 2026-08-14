/// <reference types="vitest" />
import { describe, it, expect, beforeEach } from "vitest";
import { MetricsAggregator } from "../../../src/Infrastructure/MetricsAggregator";

describe("MetricsAggregator", () => {
    let aggregator: MetricsAggregator;

    beforeEach(() => {
        aggregator = new MetricsAggregator();
    });

    it("should record and aggregate samples", async () => {
        await aggregator.recordSample({
            engineName: "core",
            metricName: "cpu",
            value: 50,
            unit: "percent",
            tags: { host: "localhost" }
        });

        await aggregator.recordSample({
            engineName: "core",
            metricName: "cpu",
            value: 70,
            unit: "percent",
            tags: { host: "localhost" }
        });

        const aggregates = await aggregator.getAggregates("core");
        const cpuMetric = aggregates.find(m => m.metricName === "cpu");

        expect(cpuMetric).toBeDefined();
        expect(cpuMetric!.min).toBe(50);
        expect(cpuMetric!.max).toBe(70);
        expect(cpuMetric!.avg).toBeCloseTo(60);
        expect(cpuMetric!.count).toBe(2);
    });

    it("should reset samples for a specific engine", async () => {
        await aggregator.recordSample({
            engineName: "core",
            metricName: "cpu",
            value: 50,
            unit: "percent",
            tags: {}
        });

        await aggregator.recordSample({
            engineName: "analytics",
            metricName: "events",
            value: 100,
            unit: "count",
            tags: {}
        });

        await aggregator.reset("core");

        const aggregates = await aggregator.getAggregates();
        expect(aggregates.find(m => m.engineName === "core")).toBeUndefined();
        expect(aggregates.find(m => m.engineName === "analytics")).toBeDefined();
    });

    it("should reset all samples", async () => {
        await aggregator.recordSample({
            engineName: "core",
            metricName: "cpu",
            value: 50,
            unit: "percent",
            tags: {}
        });

        await aggregator.reset();

        const aggregates = await aggregator.getAggregates();
        expect(aggregates).toHaveLength(0);
    });
});
