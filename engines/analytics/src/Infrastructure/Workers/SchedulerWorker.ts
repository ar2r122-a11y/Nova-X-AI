import type { IMetricRepository } from "../../Domain/Repositories/IMetricRepository";
import type { ITelemetryEventRepository } from "../../Domain/Repositories/ITelemetryEventRepository";
import type { IAnalyticsSettingsRepository } from "../../Domain/Repositories/IAnalyticsSettingsRepository";
import { RetentionService } from "../../Domain/Services/RetentionService";

export interface IAnalyticsWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}

export class SchedulerWorker implements IAnalyticsWorker {
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;

    constructor(
        private readonly metricRepository: IMetricRepository,
        private readonly telemetryEventRepository: ITelemetryEventRepository,
        private readonly settingsRepository: IAnalyticsSettingsRepository
    ) {}

    async start(): Promise<void> {
        if (this.running) return;
        this.running = true;
        this.intervalId = setInterval(async () => {
            await this.runRetention();
        }, 60000);
    }

    async stop(): Promise<void> {
        this.running = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "AnalyticsSchedulerWorker";
    }

    private async runRetention(): Promise<void> {
        try {
            const settings = await this.settingsRepository.getSettings();
            if (!settings) return;

            const retention = settings.getRetentionPeriod();
            const rawThreshold = RetentionService.getExpiryThreshold(retention, "raw");
            await this.metricRepository.deleteExpired(rawThreshold);
            await this.telemetryEventRepository.deleteExpired(rawThreshold);
        } catch {
            console.warn("Analytics retention worker failed.");
        }
    }
}
