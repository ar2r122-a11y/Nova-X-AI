import { ICoreModule } from "@nova-x-ai/core";
import type { IContainer, IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { AnalyticsEngine } from "../Infrastructure/AnalyticsEngine";
import { MetricRepositoryImpl } from "../Infrastructure/Persistence/MetricRepositoryImpl";
import { TelemetryEventRepositoryImpl } from "../Infrastructure/Persistence/TelemetryEventRepositoryImpl";
import { AnalyticsSettingsRepositoryImpl } from "../Infrastructure/Persistence/AnalyticsSettingsRepositoryImpl";
import { SchedulerWorker } from "../Infrastructure/Workers/SchedulerWorker";
import { MetricRecordedEvent } from "../Domain/Events/MetricRecordedEvent";
import { ThresholdAlertEvent } from "../Domain/Events/ThresholdAlertEvent";
import { AnalyticsPurgedEvent } from "../Domain/Events/AnalyticsPurgedEvent";
import { AnalyticsOptOutChangedEvent } from "../Domain/Events/AnalyticsOptOutChangedEvent";
import { PIIStrippedEvent } from "../Domain/Events/PIIStrippedEvent";

const ANALYTICS_ENGINE = Symbol("AnalyticsEngine");

export class AnalyticsEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/analytics";
    private engine: AnalyticsEngine | null = null;
    private workers: SchedulerWorker[] = [];

    configureServices(container: IContainer): void {
        container.registerSingleton(ANALYTICS_ENGINE, AnalyticsEngine);
    }

    async onInit(): Promise<void> {
        const eventBus = {} as IEventBus;
        const storageEngine = {} as IStorageEngine;

        const metricRepository = new MetricRepositoryImpl(storageEngine);
        const telemetryEventRepository = new TelemetryEventRepositoryImpl(storageEngine);
        const settingsRepository = new AnalyticsSettingsRepositoryImpl(storageEngine);

        const engine = new AnalyticsEngine(eventBus, metricRepository, telemetryEventRepository, settingsRepository);

        const schedulerWorker = new SchedulerWorker(
            metricRepository,
            telemetryEventRepository,
            settingsRepository
        );

        this.workers = [schedulerWorker];
        this.engine = engine;

        eventBus.subscribe("EVT_ANALYTICS_MetricRecorded", this.createHandler((event: MetricRecordedEvent) => this.handleMetricRecorded(event)));
        eventBus.subscribe("EVT_ANALYTICS_ThresholdAlert", this.createHandler((event: ThresholdAlertEvent) => this.handleThresholdAlert(event)));
        eventBus.subscribe("EVT_ANALYTICS_Purged", this.createHandler((event: AnalyticsPurgedEvent) => this.handlePurged(event)));
        eventBus.subscribe("EVT_ANALYTICS_OptOutChanged", this.createHandler((event: AnalyticsOptOutChangedEvent) => this.handleOptOutChanged(event)));
        eventBus.subscribe("EVT_ANALYTICS_PIIStripped", this.createHandler((event: PIIStrippedEvent) => this.handlePIIStripped(event)));

        for (const worker of this.workers) {
            await worker.start();
        }
    }

    async onDestroy(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.engine = null;
    }

    getAnalyticsEngine(): AnalyticsEngine | null {
        return this.engine;
    }

    private createHandler<T>(fn: (event: T) => Promise<void>): { handle: (event: T) => Promise<void> } {
        return { handle: fn };
    }

    private handleMetricRecorded(_event: MetricRecordedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleThresholdAlert(_event: ThresholdAlertEvent): Promise<void> {
        return Promise.resolve();
    }

    private handlePurged(_event: AnalyticsPurgedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handleOptOutChanged(_event: AnalyticsOptOutChangedEvent): Promise<void> {
        return Promise.resolve();
    }

    private handlePIIStripped(_event: PIIStrippedEvent): Promise<void> {
        return Promise.resolve();
    }
}
