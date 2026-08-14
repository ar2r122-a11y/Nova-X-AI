import { IAnomalyDetector } from "../Domain/Services/IAnomalyDetector";
import { AnomalyRecord } from "../Domain/Entities/AnomalyRecord";

export class AnomalyDetector implements IAnomalyDetector {
    private readonly anomalies: AnomalyRecord[] = [];
    private readonly thresholds = new Map<string, { min: number; max: number }>();

    setThreshold(engineName: string, metricName: string, min: number, max: number): void {
        this.thresholds.set(`${engineName}:${metricName}`, { min, max });
    }

    public async detect(metrics: Array<{
        engineName: string;
        metricName: string;
        value: number;
        timestamp: number;
    }>): Promise<Array<{
        engineName: string;
        anomalyType: string;
        severity: "low" | "medium" | "high" | "critical";
        message: string;
        context: Record<string, unknown>;
    }>> {
        const detected: Array<{
            engineName: string;
            anomalyType: string;
            severity: "low" | "medium" | "high" | "critical";
            message: string;
            context: Record<string, unknown>;
        }> = [];

        for (const metric of metrics) {
            const threshold = this.thresholds.get(`${metric.engineName}:${metric.metricName}`);
            if (!threshold) {
                continue;
            }

            if (metric.value < threshold.min || metric.value > threshold.max) {
                const severity = this.computeSeverity(metric.value, threshold.min, threshold.max);
                const anomaly = {
                    engineName: metric.engineName,
                    anomalyType: "metric_threshold_breach",
                    severity,
                    message: `Metric ${metric.metricName} for ${metric.engineName} breached threshold: ${metric.value} (expected ${threshold.min}-${threshold.max})`,
                    context: {
                        metricName: metric.metricName,
                        value: metric.value,
                        min: threshold.min,
                        max: threshold.max,
                        timestamp: metric.timestamp
                    }
                };

                detected.push(anomaly);
                this.anomalies.push(new AnomalyRecord({
                    id: `anomaly-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    engineName: anomaly.engineName,
                    anomalyType: anomaly.anomalyType,
                    severity: anomaly.severity,
                    message: anomaly.message,
                    detectedAt: metric.timestamp,
                    context: anomaly.context,
                    resolved: false,
                    resolvedAt: null
                }));
            }
        }

        return detected;
    }

    public async getUnresolved(): Promise<Array<{
        id: string;
        engineName: string;
        anomalyType: string;
        severity: string;
        message: string;
        detectedAt: number;
    }>> {
        return this.anomalies
            .filter(a => !a.isResolved())
            .map(a => ({
                id: a.getId(),
                engineName: a.getEngineName(),
                anomalyType: a.getAnomalyType(),
                severity: a.getSeverity(),
                message: a.getMessage(),
                detectedAt: a.getDetectedAt()
            }));
    }

    public async resolve(id: string): Promise<void> {
        for (let i = 0; i < this.anomalies.length; i++) {
            if (this.anomalies[i].getId() === id) {
                this.anomalies[i] = this.anomalies[i].resolve(Date.now());
                break;
            }
        }
    }

    private computeSeverity(value: number, min: number, max: number): "low" | "medium" | "high" | "critical" {
        const range = max - min;
        const deviation = value < min ? min - value : value - max;
        const ratio = deviation / (range || 1);

        if (ratio >= 2) return "critical";
        if (ratio >= 1) return "high";
        if (ratio >= 0.5) return "medium";
        return "low";
    }
}
