import type { IAudioStreamingWorker, WorkerHealthReport, StreamRequest, StreamHandle } from "../../Contracts/IAudioStreamingWorker";
import type { RuntimeConfiguration } from "../../Contracts/Runtime";

export abstract class BaseVoiceWorker implements IAudioStreamingWorker {
    protected engine: import("../../Contracts/IVoiceEngine").IVoiceEngine | null = null;
    protected voiceId: import("../../Domain/ValueObjects/VoiceId").VoiceId | null = null;
    protected intervalId: ReturnType<typeof setInterval> | null = null;
    protected running = false;
    protected paused = false;
    protected initialized = false;
    protected failureCount = 0;
    protected lastTickDurationMs = 0;
    protected lastError: string | undefined;
    protected tickMs: number;
    protected config: RuntimeConfiguration | null = null;

    constructor(tickMs: number) {
        this.tickMs = tickMs;
    }

    setEngine(engine: import("../../Contracts/IVoiceEngine").IVoiceEngine): void {
        this.engine = engine;
    }

    setVoiceId(voiceId: import("../../Domain/ValueObjects/VoiceId").VoiceId): void {
        this.voiceId = voiceId;
    }

    configure(config: RuntimeConfiguration): void {
        this.config = config;
    }

    async start(): Promise<void> {
        if (this.running) return;
        if (!this.engine || !this.voiceId) {
            throw new Error(`${this.getWorkerName()} requires engine and voiceId before start.`);
        }
        this.running = true;
        this.paused = false;
        this.initialized = true;
        this.intervalId = setInterval(() => {
            this.tick();
        }, this.tickMs);
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.running = false;
        this.paused = false;
        this.initialized = false;
    }

    async pause(): Promise<void> {
        this.paused = true;
    }

    async resume(): Promise<void> {
        this.paused = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return this.constructor.name;
    }

    get workerName(): string {
        return this.getWorkerName();
    }

    getHealth(): WorkerHealthReport {
        return {
            workerName: this.getWorkerName(),
            isRunning: this.running,
            lastTickDurationMs: this.lastTickDurationMs,
            failureCount: this.failureCount,
            lastError: this.lastError,
            status: this.getHealthStatus()
        };
    }

    enqueueStream(request: StreamRequest): Promise<StreamHandle> {
        throw new Error("enqueueStream not implemented");
    }

    cancelStream(streamId: string): Promise<void> {
        throw new Error("cancelStream not implemented");
    }

    protected abstract tickImpl(): Promise<void>;

    protected getEngine(): import("../../Contracts/IVoiceEngine").IVoiceEngine {
        if (!this.engine) throw new Error(`${this.getWorkerName()} not configured with engine.`);
        return this.engine;
    }

    protected getVoiceId(): import("../../Domain/ValueObjects/VoiceId").VoiceId {
        if (!this.voiceId) throw new Error(`${this.getWorkerName()} not configured with voiceId.`);
        return this.voiceId;
    }

    protected getConfig(): RuntimeConfiguration {
        if (!this.config) throw new Error(`${this.getWorkerName()} not configured.`);
        return this.config;
    }

    private async tick(): Promise<void> {
        if (!this.running || this.paused) return;
        const start = Date.now();
        try {
            await this.tickImpl();
            this.failureCount = 0;
            this.lastError = undefined;
        } catch (error) {
            this.failureCount++;
            this.lastError = error instanceof Error ? error.message : String(error);
        } finally {
            this.lastTickDurationMs = Date.now() - start;
        }
    }

    private getHealthStatus(): "healthy" | "degraded" | "unhealthy" {
        if (this.failureCount === 0 && this.running) return "healthy";
        if (this.failureCount > 0 && this.failureCount < 5 && this.running) return "degraded";
        return "unhealthy";
    }
}
