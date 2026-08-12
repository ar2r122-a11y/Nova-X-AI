import { IEventBus } from "@nova-x-ai/core";
import type { IVoiceEngine } from "../../Contracts/IVoiceEngine";
import type { IVoiceRuntime } from "../../Contracts/Runtime/IVoiceRuntime";
import type { IAudioStreamingWorker } from "../../Contracts/IAudioStreamingWorker";
import type { IProviderHealthCheck } from "../../Contracts/IProviderHealthCheck";
import type { RuntimeConfiguration, VoiceRuntimeState } from "../../Contracts/Runtime";
import { isValidRuntimeTransition } from "../../Contracts/Runtime";
import { AudioStreamingWorker } from "../Workers/AudioStreamingWorker";
import { VoiceRecoveryWorker } from "../Workers/VoiceRecoveryWorker";
import { SchedulerWorker } from "../Workers/SchedulerWorker";
import { ProjectionWorker } from "../Workers/ProjectionWorker";
import { CleanupWorker } from "../Workers/CleanupWorker";
import { SnapshotWorker } from "../Workers/SnapshotWorker";
import { VoiceHealthCheck } from "../Health/VoiceHealthCheck";
import { VoiceEngineOpenApi } from "../Integration/VoiceEngineOpenApi";
import { VoiceEngineSecurity } from "../Integration/VoiceEngineSecurity";
import { VoiceEngineAclTranslator } from "../Integration/VoiceEngineAclTranslator";

export class VoiceRuntimeImpl implements IVoiceRuntime {
    private currentState: VoiceRuntimeState = "initialized";
    private readonly workersList: IAudioStreamingWorker[] = [];
    private readonly healthChecksList: IProviderHealthCheck[] = [];
    private openApi: VoiceEngineOpenApi | null = null;
    private security: VoiceEngineSecurity | null = null;
    private acl: VoiceEngineAclTranslator | null = null;
    private startedAt = 0;
    private shutdownRequested = false;

    readonly workers: IAudioStreamingWorker[] = [];
    readonly healthChecks: IProviderHealthCheck[] = [];

    constructor(
        public readonly engine: IVoiceEngine,
        private readonly eventBus: IEventBus,
        public readonly configuration: RuntimeConfiguration
    ) {}

    async start(voiceId: string): Promise<void> {
        this.transitionState("waiting_for_input");
        this.startedAt = Date.now();

        this.initializeWorkers(voiceId);
        this.initializeHealthChecks();
        this.openApi = new VoiceEngineOpenApi(this.engine, this);
        this.security = new VoiceEngineSecurity();
        this.acl = new VoiceEngineAclTranslator();

        for (const worker of this.workers) {
            try {
                worker.configure(this.configuration);
                await worker.start();
            } catch (error) {
                await this.handleWorkerFailure(worker, error);
            }
        }
    }

    async stop(voiceId: string): Promise<void> {
        this.shutdownRequested = true;

        const stopPromises: Promise<void>[] = [];
        for (const worker of this.workers) {
            if (worker.isRunning()) {
                stopPromises.push(worker.stop().catch(() => {}));
            }
        }
        await Promise.all(stopPromises);

        this.transitionState("completed");
        this.shutdownRequested = false;
    }

    async pause(): Promise<void> {
        this.transitionState("paused");
        for (const worker of this.workers) {
            if (worker.isRunning()) {
                await worker.pause().catch(() => {});
            }
        }
    }

    async resume(): Promise<void> {
        this.transitionState("waiting_for_input");
        for (const worker of this.workers) {
            if (worker.isRunning()) {
                await worker.resume().catch(() => {});
            }
        }
    }

    async transitionTo(targetState: VoiceRuntimeState): Promise<void> {
        if (!isValidRuntimeTransition(this.currentState, targetState)) {
            throw new Error(`Invalid runtime state transition: ${this.currentState} -> ${targetState}`);
        }
        this.currentState = targetState;

        if (targetState === "paused") {
            for (const worker of this.workers) {
                if (worker.isRunning()) {
                    await worker.pause().catch(() => {});
                }
            }
        } else if (targetState === "waiting_for_input" || targetState === "streaming_audio") {
            for (const worker of this.workers) {
                if (worker.isRunning()) {
                    await worker.resume().catch(() => {});
                }
            }
        }
    }

    async handleFailure(reason: string, voiceId: string): Promise<void> {
        this.transitionState("failed");

        for (const worker of this.workers) {
            if (worker.isRunning()) {
                await worker.stop().catch(() => {});
            }
        }
    }

    async recover(voiceId: string): Promise<void> {
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
            await this.engine.initialize(voiceId);
            this.currentState = "waiting_for_input";
        } catch {
            this.currentState = "failed";
            throw new Error("Recovery failed: could not restore voice state.");
        }
    }

    async takeSnapshot(voiceId: string): Promise<object> {
        if (this.currentState === "completed") {
            throw new Error("Runtime is completed. Cannot take snapshot.");
        }
        return this.engine.takeSnapshot(voiceId);
    }

    get currentRuntimeState(): VoiceRuntimeState {
        return this.currentState;
    }

    get workerList(): IAudioStreamingWorker[] {
        return [...this.workers];
    }

    get healthCheckList(): IProviderHealthCheck[] {
        return [...this.healthChecks];
    }

    get openApiRef(): VoiceEngineOpenApi | null {
        return this.openApi;
    }

    get securityRef(): VoiceEngineSecurity | null {
        return this.security;
    }

    get aclRef(): VoiceEngineAclTranslator | null {
        return this.acl;
    }

    getState(): VoiceRuntimeState {
        return this.currentState;
    }

    getUptimeMs(): number {
        return this.startedAt > 0 ? Date.now() - this.startedAt : 0;
    }

    getWorkers(): readonly IAudioStreamingWorker[] {
        return this.workers;
    }

    getHealthChecks(): readonly IProviderHealthCheck[] {
        return this.healthChecks;
    }

    getOpenApi(): VoiceEngineOpenApi | null {
        return this.openApi;
    }

    getSecurity(): VoiceEngineSecurity | null {
        return this.security;
    }

    getAcl(): VoiceEngineAclTranslator | null {
        return this.acl;
    }

    getEngine(): IVoiceEngine {
        return this.engine;
    }

    getConfiguration(): RuntimeConfiguration {
        return { ...this.configuration };
    }

    isShutdownRequested(): boolean {
        return this.shutdownRequested;
    }

    private initializeWorkers(_voiceId: string): void {
        const streamingWorker = new AudioStreamingWorker();
        const recoveryWorker = new VoiceRecoveryWorker();
        const schedulerWorker = new SchedulerWorker();
        const projectionWorker = new ProjectionWorker();
        const cleanupWorker = new CleanupWorker();
        const snapshotWorker = new SnapshotWorker();

        [streamingWorker, recoveryWorker, schedulerWorker, projectionWorker, cleanupWorker, snapshotWorker].forEach(w => {
            const workerWithRuntime = w as unknown as { setRuntime(runtime: IVoiceRuntime): void };
            if (typeof workerWithRuntime.setRuntime === "function") {
                workerWithRuntime.setRuntime(this);
            }
        });

        this.workers.push(streamingWorker, recoveryWorker, schedulerWorker, projectionWorker, cleanupWorker, snapshotWorker);
    }

    private initializeHealthChecks(): void {
        this.healthChecks.push(new VoiceHealthCheck(this.engine, this.workers) as unknown as IProviderHealthCheck);
    }

    private async handleWorkerFailure(worker: IAudioStreamingWorker, error: unknown): Promise<void> {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const health = worker.getHealth();
        if (health.failureCount >= this.configuration.maxConsecutiveFailures) {
            await worker.stop().catch(() => {});
        }
    }

    private transitionState(target: VoiceRuntimeState): void {
        if (!isValidRuntimeTransition(this.currentState, target)) {
            throw new Error(`Invalid runtime state transition: ${this.currentState} -> ${target}`);
        }
        this.currentState = target;
    }
}
