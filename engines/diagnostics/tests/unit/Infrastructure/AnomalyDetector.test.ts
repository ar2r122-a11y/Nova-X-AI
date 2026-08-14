/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AnomalyDetector } from "../../../src/Infrastructure/AnomalyDetector";

describe("AnomalyDetector", () => {
    let detector: AnomalyDetector;

    beforeEach(() => {
        detector = new AnomalyDetector();
        detector.setThreshold("core", "cpu", 0, 100);
        detector.setThreshold("core", "memory", 0, 1024);
    });

    it("should detect a critical threshold breach", async () => {
        const anomalies = await detector.detect([
            {
                engineName: "core",
                metricName: "cpu",
                value: 250,
                timestamp: Date.now()
            }
        ]);

        expect(anomalies).toHaveLength(1);
        expect(anomalies[0].severity).toBe("high");
        expect(anomalies[0].anomalyType).toBe("metric_threshold_breach");
    });

    it("should not detect anomalies within threshold", async () => {
        const anomalies = await detector.detect([
            {
                engineName: "core",
                metricName: "cpu",
                value: 50,
                timestamp: Date.now()
            }
        ]);

        expect(anomalies).toHaveLength(0);
    });

    it("should return unresolved anomalies", async () => {
        await detector.detect([
            {
                engineName: "core",
                metricName: "memory",
                value: 2000,
                timestamp: Date.now()
            }
        ]);

        const unresolved = await detector.getUnresolved();
        expect(unresolved).toHaveLength(1);
        expect(unresolved[0].engineName).toBe("core");
    });

    it("should resolve anomalies", async () => {
        await detector.detect([
            {
                engineName: "core",
                metricName: "memory",
                value: 2000,
                timestamp: Date.now()
            }
        ]);

        const unresolvedBefore = await detector.getUnresolved();
        await detector.resolve(unresolvedBefore[0].id);

        const unresolvedAfter = await detector.getUnresolved();
        expect(unresolvedAfter).toHaveLength(0);
    });
});
