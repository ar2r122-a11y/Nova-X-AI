import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { IWorldWorker, RuntimeConfiguration, WorkerHealthReport } from "../../Contracts/index";
import { WorldId } from "../../Domain/ValueObjects/WorldId";

export interface WorkerContext {
    readonly engine: IWorldEngine;
    readonly worldId: WorldId;
    readonly config: RuntimeConfiguration;
}

export abstract class BaseWorldWorker implements IWorldWorker {
    protected engine: IWorldEngine | null = null;
    protected worldId: WorldId | null = null;
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

    setEngine(engine: IWorldEngine): void {
        this.engine = engine;
    }

    setWorldId(worldId: WorldId): void {
        this.worldId = worldId;
    }

    configure(config: RuntimeConfiguration): void {
        this.config = config;
    }

    setTickInterval(ms: number): void {
        this.tickMs = ms;
    }

    async start(): Promise<void> {
        if (this.running) return;
        if (!this.engine || !this.worldId) {
            throw new Error(`${this.getWorkerName()} requires engine and worldId before start.`);
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

    protected abstract tickImpl(): Promise<void>;

    protected getEngine(): IWorldEngine {
        if (!this.engine) throw new Error(`${this.getWorkerName()} not configured with engine.`);
        return this.engine;
    }

    protected getWorldId(): WorldId {
        if (!this.worldId) throw new Error(`${this.getWorkerName()} not configured with worldId.`);
        return this.worldId;
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
