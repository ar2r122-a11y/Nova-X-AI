import { IDiagnosticsStreamingWorker } from "../Contracts";
import type { IHealthProbe } from "../Domain/Services/IHealthProbe";
import type { IMetricsAggregator } from "../Domain/Services/IMetricsAggregator";
import type { IAnomalyDetector } from "../Domain/Services/IAnomalyDetector";
import type { IOpenTelemetryAdapter } from "../Domain/Services/IOpenTelemetryAdapter";
import { IEventBus } from "@nova-x-ai/core";
import { AnomalyDetectedEvent } from "../Domain/Events/AnomalyDetectedEvent";

export class DiagnosticsStreamingWorker implements IDiagnosticsStreamingWorker {
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private readonly metricFrequencyMs: number;

    constructor(
        private readonly healthProbe: IHealthProbe,
        private readonly metricsAggregator: IMetricsAggregator,
        private readonly anomalyDetector: IAnomalyDetector,
        private readonly openTelemetryAdapter: IOpenTelemetryAdapter,
        private readonly eventBus: IEventBus,
        metricFrequencyMs = 1000
    ) {
        this.metricFrequencyMs = metricFrequencyMs;
    }

    public getWorkerName(): string {
        return "DiagnosticsStreamingWorker";
    }

    public async start(): Promise<void> {
        if (this.running) {
            return;
        }

        this.running = true;
        this.intervalId = setInterval(() => {
            this.tick().catch(() => {});
        }, this.metricFrequencyMs);
    }

    public async stop(): Promise<void> {
        this.running = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    public async interrupt(): Promise<void> {
        await this.stop();
    }

    public isRunning(): boolean {
        return this.running;
    }

    private async tick(): Promise<void> {
        try {
            const metrics = await this.metricsAggregator.getAggregates();
            const anomalies = await this.anomalyDetector.detect(metrics.map(m => ({
                engineName: m.engineName,
                metricName: m.metricName,
                value: m.avg,
                timestamp: Date.now()
            })));

            for (const anomaly of anomalies) {
                await this.eventBus.publish(new AnomalyDetectedEvent({
                    engineName: anomaly.engineName,
                    anomalyType: anomaly.anomalyType,
                    severity: anomaly.severity,
                    message: anomaly.message,
                    context: anomaly.context,
                    correlationId: `diag-stream-${Date.now()}`
                }));
            }
        } catch {
            // Worker tick failure should not crash the runtime
        }
    }
}
