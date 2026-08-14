import { IEventBus, IDomainEvent } from "@nova-x-ai/core";
import type { IDiagnosticsEngine } from "../Contracts";
import type { IHealthProbe } from "../Domain/Services/IHealthProbe";
import type { IMetricsAggregator } from "../Domain/Services/IMetricsAggregator";
import type { IAnomalyDetector } from "../Domain/Services/IAnomalyDetector";
import type { ILogVault } from "../Domain/Services/ILogVault";
import type { IOpenTelemetryAdapter } from "../Domain/Services/IOpenTelemetryAdapter";
import type { IHeapSnapshotOrchestrator } from "../Domain/Services/IHeapSnapshotOrchestrator";
import type { IThreadWorkerProfiler } from "../Domain/Services/IThreadWorkerProfiler";
import type { IMemoryLeakDetector } from "../Domain/Services/IMemoryLeakDetector";
import { DiagnosticsExecutionFailedEvent } from "../Domain/Events/DiagnosticsExecutionFailedEvent";
import { DiagnosticsRecoveryEvent } from "../Domain/Events/DiagnosticsRecoveryEvent";
import { OpenTelemetryRegistry } from "./OpenTelemetryRegistry";
import { HealthProbe } from "./HealthProbe";
import { MetricsAggregator } from "./MetricsAggregator";
import { AnomalyDetector } from "./AnomalyDetector";
import { LogVault } from "./LogVault";
import { HeapSnapshotOrchestrator } from "./HeapSnapshotOrchestrator";
import { ThreadWorkerProfiler } from "./ThreadWorkerProfiler";
import { MemoryLeakDetector } from "./MemoryLeakDetector";
import { DiagnosticsStreamingWorker } from "./DiagnosticsStreamingWorker";
import { CrossEngineDiagnosticsCoordinator } from "./CrossEngineDiagnosticsCoordinator";

export class DiagnosticsEngine implements IDiagnosticsEngine {
    readonly healthProbes: IHealthProbe[];
    readonly metricsAggregator: IMetricsAggregator;
    readonly anomalyDetector: IAnomalyDetector;
    readonly logVault: ILogVault;
    readonly openTelemetryAdapter: IOpenTelemetryAdapter;
    readonly heapSnapshotOrchestrator: IHeapSnapshotOrchestrator;
    readonly threadWorkerProfiler: IThreadWorkerProfiler;
    readonly memoryLeakDetector: IMemoryLeakDetector;

    private readonly eventBus: IEventBus;
    private readonly streamingWorker: DiagnosticsStreamingWorker;
    private readonly coordinator: CrossEngineDiagnosticsCoordinator;
    private initialized = false;

    constructor(eventBus: IEventBus) {
        this.eventBus = eventBus;
        this.healthProbes = [];
        this.metricsAggregator = new MetricsAggregator();
        this.anomalyDetector = new AnomalyDetector();
        this.logVault = new LogVault();
        this.openTelemetryAdapter = new OpenTelemetryRegistry();
        this.heapSnapshotOrchestrator = new HeapSnapshotOrchestrator();
        this.threadWorkerProfiler = new ThreadWorkerProfiler();
        this.memoryLeakDetector = new MemoryLeakDetector();
        this.streamingWorker = new DiagnosticsStreamingWorker(
            this.healthProbes[0] ?? new HealthProbe("default"),
            this.metricsAggregator,
            this.anomalyDetector,
            this.openTelemetryAdapter,
            this.eventBus
        );
        this.coordinator = new CrossEngineDiagnosticsCoordinator(this, this.logVault);
    }

    public async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        try {
            await this.logVault.append({
                level: "info",
                message: "Diagnostics engine initializing",
                engine: "diagnostics"
            });

            await this.streamingWorker.start();

            this.initialized = true;

            await this.logVault.append({
                level: "info",
                message: "Diagnostics engine initialized",
                engine: "diagnostics"
            });
        } catch (error) {
            await this.eventBus.publish(new DiagnosticsExecutionFailedEvent({
                engine: "diagnostics",
                reason: error instanceof Error ? error.message : "Unknown initialization error",
                correlationId: `diag-init-${Date.now()}`
            }));

            throw error;
        }
    }

    public async shutdown(): Promise<void> {
        if (!this.initialized) {
            return;
        }

        try {
            await this.streamingWorker.stop();
            await this.eventBus.publish(new DiagnosticsRecoveryEvent({
                engine: "diagnostics",
                action: "shutdown",
                correlationId: `diag-shutdown-${Date.now()}`
            }));
            this.initialized = false;
        } catch (error) {
            await this.eventBus.publish(new DiagnosticsExecutionFailedEvent({
                engine: "diagnostics",
                reason: error instanceof Error ? error.message : "Shutdown error",
                correlationId: `diag-shutdown-fail-${Date.now()}`
            }));
        }
    }

    public registerHealthProbe(probe: IHealthProbe): void {
        this.healthProbes.push(probe);
        if (this.streamingWorker instanceof DiagnosticsStreamingWorker) {
            // Update streaming worker with the first probe for tick loop
        }
    }

    public async getDiagnosticsBudget(): Promise<{
        maxSpans: number;
        activeSpans: number;
        logVaultQuotaBytes: number;
        logVaultUsedBytes: number;
        telemetryBufferBytes: number;
        telemetryBufferUsedBytes: number;
        metricSampleFrequencyMs: number;
        profileTimeoutMs: number;
        maxRetries: number;
    }> {
        const logVaultUsage = await this.logVault.getQuotaUsage();
        const activeSpans = await this.openTelemetryAdapter.getActiveSpanCount();

        return {
            maxSpans: 1000,
            activeSpans,
            logVaultQuotaBytes: logVaultUsage.quotaBytes,
            logVaultUsedBytes: logVaultUsage.usedBytes,
            telemetryBufferBytes: 16 * 1024 * 1024,
            telemetryBufferUsedBytes: activeSpans * 1024,
            metricSampleFrequencyMs: 1000,
            profileTimeoutMs: 30000,
            maxRetries: 3
        };
    }
}
