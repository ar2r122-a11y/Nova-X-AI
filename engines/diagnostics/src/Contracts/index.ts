import type { IHealthProbe } from "../Domain/Services/IHealthProbe";
import type { IMetricsAggregator } from "../Domain/Services/IMetricsAggregator";
import type { IAnomalyDetector } from "../Domain/Services/IAnomalyDetector";
import type { ILogVault } from "../Domain/Services/ILogVault";
import type { IOpenTelemetryAdapter } from "../Domain/Services/IOpenTelemetryAdapter";
import type { IHeapSnapshotOrchestrator } from "../Domain/Services/IHeapSnapshotOrchestrator";
import type { IThreadWorkerProfiler } from "../Domain/Services/IThreadWorkerProfiler";
import type { IMemoryLeakDetector } from "../Domain/Services/IMemoryLeakDetector";

export interface IDiagnosticsEngine {
    readonly healthProbes: IHealthProbe[];
    readonly metricsAggregator: IMetricsAggregator;
    readonly anomalyDetector: IAnomalyDetector;
    readonly logVault: ILogVault;
    readonly openTelemetryAdapter: IOpenTelemetryAdapter;
    readonly heapSnapshotOrchestrator: IHeapSnapshotOrchestrator;
    readonly threadWorkerProfiler: IThreadWorkerProfiler;
    readonly memoryLeakDetector: IMemoryLeakDetector;

    initialize(): Promise<void>;
    shutdown(): Promise<void>;
    registerHealthProbe(probe: IHealthProbe): void;
    getDiagnosticsBudget(): Promise<{
        maxSpans: number;
        activeSpans: number;
        logVaultQuotaBytes: number;
        logVaultUsedBytes: number;
        telemetryBufferBytes: number;
        telemetryBufferUsedBytes: number;
        metricSampleFrequencyMs: number;
        profileTimeoutMs: number;
        maxRetries: number;
    }>;
}

export interface IDiagnosticsStreamingWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    interrupt(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}

export interface IOpenTelemetryRegistry {
    startSpan(name: string, traceId: string, parentSpanId?: string): Promise<{
        spanId: string;
        traceId: string;
        startTime: number;
    }>;
    endSpan(spanId: string, traceId: string, status: "ok" | "error", attributes?: Record<string, unknown>): Promise<void>;
    getActiveSpanCount(): Promise<number>;
    exportSpans(): Promise<Array<Record<string, unknown>>>;
    clear(): Promise<void>;
}

export interface IHeapSnapshotOrchestratorPublic {
    capture(engine: string, correlationId: string): Promise<{
        snapshotId: string;
        capturedAt: number;
        durationMs: number;
        totalHeapSizeBytes: number;
        usedHeapSizeBytes: number;
        nodeCount: number;
        edgeCount: number;
    }>;
    getSnapshot(snapshotId: string): Promise<{
        snapshotId: string;
        capturedAt: number;
        durationMs: number;
        totalHeapSizeBytes: number;
        usedHeapSizeBytes: number;
        nodeCount: number;
        edgeCount: number;
    } | null>;
    listSnapshots(engine?: string): Promise<Array<{
        snapshotId: string;
        capturedAt: number;
        engine: string;
        nodeCount: number;
        edgeCount: number;
    }>>;
    deleteSnapshot(snapshotId: string): Promise<void>;
}

export interface IThreadWorkerProfilerPublic {
    startProfile(workerName: string): Promise<string>;
    stopProfile(profileId: string): Promise<{
        profileId: string;
        workerName: string;
        durationMs: number;
        samples: Array<{
            timestamp: number;
            cpuUsagePercent: number;
            memoryUsageBytes: number;
        }>;
    }>;
    getActiveProfiles(): Promise<string[]>;
    getAllProfiles(workerName?: string): Promise<Array<{
        profileId: string;
        workerName: string;
        durationMs: number;
        sampleCount: number;
    }>>;
}

export interface IMemoryLeakDetectorPublic {
    recordAllocation(engine: string, bytes: number, label?: string): Promise<void>;
    detectLeaks(): Promise<Array<{
        engine: string;
        label: string | null;
        allocatedBytes: number;
        allocationCount: number;
        firstSeen: number;
        lastSeen: number;
    }>>;
    reset(engine?: string): Promise<void>;
}
