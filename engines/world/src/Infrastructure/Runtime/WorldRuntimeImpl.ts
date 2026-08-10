import { IEventBus } from "@nova-x-ai/core";
import type { IWorldEngine } from "../../Contracts/IWorldEngine";
import type { IWorldRuntime } from "../../Contracts/Runtime/IWorldRuntime";
import type { IWorldWorker } from "../../Contracts/Workers/IWorldWorker";
import type { IWorldHealthCheck } from "../../Contracts/Health/IWorldHealthCheck";
import type { IWorldSimulationSaga } from "../../Contracts/Saga/index";
import type { IWorldEngineOpenApi } from "../../Contracts/Integration/IWorldEngineOpenApi";
import type { IWorldEngineSecurity } from "../../Contracts/Integration/IWorldEngineSecurity";
import type { IWorldEngineAclTranslator } from "../../Contracts/Integration/IWorldEngineAclTranslator";
import type { RuntimeConfiguration, WorldRuntimeState } from "../../Contracts/Runtime/index";
import { isValidRuntimeTransition } from "../../Contracts/Runtime/WorldRuntimeState";
import { ClockWorker } from "../Workers/ClockWorker";
import { WeatherWorker } from "../Workers/WeatherWorker";
import { SnapshotWorker } from "../Workers/SnapshotWorker";
import { EventSchedulerWorker } from "../Workers/EventSchedulerWorker";
import { CleanupWorker } from "../Workers/CleanupWorker";
import { ProjectionWorker } from "../Workers/ProjectionWorker";
import { WorldHealthCheck } from "../Health/WorldHealthCheck";
import { WorldSimulationSaga } from "../Saga/WorldSimulationSaga";
import { WorldEngineOpenApi } from "../Integration/WorldEngineOpenApi";
import { WorldEngineSecurity } from "../Integration/WorldEngineSecurity";
import { WorldEngineAclTranslator } from "../Integration/WorldEngineAclTranslator";

export class WorldRuntimeImpl implements IWorldRuntime {
    private currentState: WorldRuntimeState = "initialized";
    private readonly workersList: IWorldWorker[] = [];
    private readonly healthChecksList: IWorldHealthCheck[] = [];
    private saga: IWorldSimulationSaga | null = null;
    private openApi: IWorldEngineOpenApi | null = null;
    private security: IWorldEngineSecurity | null = null;
    private acl: IWorldEngineAclTranslator | null = null;
    private startedAt = 0;
    private tickCount = 0;
    private shutdownRequested = false;

    readonly workers: IWorldWorker[] = [];
    readonly healthChecks: IWorldHealthCheck[] = [];

    constructor(
        public readonly engine: IWorldEngine,
        private readonly eventBus: IEventBus,
        public readonly configuration: RuntimeConfiguration
    ) {}

    async start(worldId: string): Promise<void> {
        this.transitionState("active");
        this.startedAt = Date.now();
        this.tickCount = 0;

        this.initializeWorkers(worldId);
        this.initializeHealthChecks();
        this.saga = new WorldSimulationSaga(this.eventBus);
        this.openApi = new WorldEngineOpenApi(this.engine);
        this.security = new WorldEngineSecurity();
        this.acl = new WorldEngineAclTranslator();

        for (const worker of this.workers) {
            try {
                worker.configure(this.configuration);
                await worker.start();
            } catch (error) {
                await this.handleWorkerFailure(worker, error);
            }
        }
    }

    async stop(worldId: string): Promise<void> {
        this.shutdownRequested = true;

        const stopPromises: Promise<void>[] = [];
        for (const worker of this.workers) {
            if (worker.isRunning()) {
                stopPromises.push(worker.stop().catch(() => {}));
            }
        }
        await Promise.all(stopPromises);

        if (this.saga) {
            const sagaState = this.saga.getProcessState();
            if (sagaState === "running" || sagaState === "compensating") {
                await this.saga.fail("Runtime shutdown requested").catch(() => {});
            }
        }

        this.transitionState("archived");
        this.shutdownRequested = false;
    }

    async pause(): Promise<void> {
        this.transitionState("time_paused");
        for (const worker of this.workers) {
            if (worker.isRunning()) {
                await worker.pause().catch(() => {});
            }
        }
    }

    async resume(): Promise<void> {
        this.transitionState("simulation_running");
        for (const worker of this.workers) {
            if (worker.isRunning()) {
                await worker.resume().catch(() => {});
            }
        }
    }

    async transitionTo(targetState: WorldRuntimeState): Promise<void> {
        if (!isValidRuntimeTransition(this.currentState, targetState)) {
            throw new Error(`Invalid runtime state transition: ${this.currentState} -> ${targetState}`);
        }
        this.currentState = targetState;

        if (targetState === "time_paused" || targetState === "environmental_shift") {
            for (const worker of this.workers) {
                if (worker.isRunning()) {
                    await worker.pause().catch(() => {});
                }
            }
        } else if (targetState === "simulation_running" || targetState === "active") {
            for (const worker of this.workers) {
                if (worker.isRunning()) {
                    await worker.resume().catch(() => {});
                }
            }
        }
    }

    async handleFailure(reason: string, worldId: string): Promise<void> {
        this.transitionState("failed");

        for (const worker of this.workers) {
            if (worker.isRunning()) {
                await worker.stop().catch(() => {});
            }
        }

        if (this.saga) {
            await this.saga.fail(reason).catch(() => {});
        }
    }

    async recover(worldId: string): Promise<void> {
        this.transitionState("recovering");

        for (const worker of this.workers) {
            try {
                await worker.stop().catch(() => {});
                await worker.start().catch(() => {});
            } catch {
                await this.handleWorkerFailure(worker, new Error("Recovery failed for worker"));
            }
        }

        try {
            await this.engine.transitionWorldState(worldId, "active");
            this.currentState = "active";
        } catch {
            this.currentState = "failed";
            throw new Error("Recovery failed: could not restore world state.");
        }
    }

    async takeSnapshot(worldId: string): Promise<object> {
        if (this.currentState === "archived") {
            throw new Error("Runtime is archived. Cannot take snapshot.");
        }
        return this.engine.takeSnapshot(worldId);
    }

    get currentRuntimeState(): WorldRuntimeState {
        return this.currentState;
    }

    get workerList(): IWorldWorker[] {
        return [...this.workers];
    }

    get healthCheckList(): IWorldHealthCheck[] {
        return [...this.healthChecks];
    }

    get sagaRef(): IWorldSimulationSaga | null {
        return this.saga;
    }

    get openApiRef(): IWorldEngineOpenApi | null {
        return this.openApi;
    }

    get securityRef(): IWorldEngineSecurity | null {
        return this.security;
    }

    get aclRef(): IWorldEngineAclTranslator | null {
        return this.acl;
    }

    getState(): WorldRuntimeState {
        return this.currentState;
    }

    getUptimeMs(): number {
        return this.startedAt > 0 ? Date.now() - this.startedAt : 0;
    }

    getTickCount(): number {
        return this.tickCount;
    }

    incrementTick(): void {
        this.tickCount++;
    }

    getWorkers(): readonly IWorldWorker[] {
        return this.workers;
    }

    getHealthChecks(): readonly IWorldHealthCheck[] {
        return this.healthChecks;
    }

    getSaga(): IWorldSimulationSaga | null {
        return this.saga;
    }

    getOpenApi(): IWorldEngineOpenApi | null {
        return this.openApi;
    }

    getSecurity(): IWorldEngineSecurity | null {
        return this.security;
    }

    getAcl(): IWorldEngineAclTranslator | null {
        return this.acl;
    }

    getEngine(): IWorldEngine {
        return this.engine;
    }

    getConfiguration(): RuntimeConfiguration {
        return { ...this.configuration };
    }

    isShutdownRequested(): boolean {
        return this.shutdownRequested;
    }

    private initializeWorkers(_worldId: string): void {
        const clockWorker = new ClockWorker();
        const weatherWorker = new WeatherWorker();
        const snapshotWorker = new SnapshotWorker();
        const eventSchedulerWorker = new EventSchedulerWorker();
        const cleanupWorker = new CleanupWorker();
        const projectionWorker = new ProjectionWorker();

        [clockWorker, weatherWorker, snapshotWorker, eventSchedulerWorker, cleanupWorker, projectionWorker].forEach(w => {
            const workerWithRuntime = w as unknown as { setRuntime(runtime: IWorldRuntime): void };
            if (typeof workerWithRuntime.setRuntime === "function") {
                workerWithRuntime.setRuntime(this);
            }
        });

        this.workers.push(clockWorker, weatherWorker, snapshotWorker, eventSchedulerWorker, cleanupWorker, projectionWorker);
    }

    private initializeHealthChecks(): void {
        this.healthChecks.push(new WorldHealthCheck(this.engine, this.workers));
    }

    private async handleWorkerFailure(worker: IWorldWorker, error: unknown): Promise<void> {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const health = worker.getHealth();
        if (health.failureCount >= this.configuration.maxConsecutiveFailures) {
            await worker.stop().catch(() => {});
        }
    }

    private transitionState(target: WorldRuntimeState): void {
        if (!isValidRuntimeTransition(this.currentState, target)) {
            throw new Error(`Invalid runtime state transition: ${this.currentState} -> ${target}`);
        }
        this.currentState = target;
    }
}
