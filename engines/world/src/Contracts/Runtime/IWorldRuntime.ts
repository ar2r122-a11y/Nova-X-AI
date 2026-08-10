import type { IWorldEngine } from "../IWorldEngine";
import type { WorldRuntimeState, RuntimeConfiguration, WorldRuntimeStateChangedEvent, WorkerLifecycleEvent } from "./index";
import type { IWorldWorker } from "../Workers/IWorldWorker";
import type { IWorldHealthCheck } from "../Health/IWorldHealthCheck";
import type { IWorldSimulationSaga } from "../Saga/index";
import type { IWorldEngineOpenApi } from "../Integration/IWorldEngineOpenApi";
import type { IWorldEngineSecurity } from "../Integration/IWorldEngineSecurity";
import type { IWorldEngineAclTranslator } from "../Integration/IWorldEngineAclTranslator";

export interface IWorldRuntime {
    readonly engine: IWorldEngine;
    readonly configuration: RuntimeConfiguration;

    start(worldId: string): Promise<void>;
    stop(worldId: string): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    transitionTo(targetState: WorldRuntimeState): Promise<void>;
    handleFailure(reason: string, worldId: string): Promise<void>;
    recover(worldId: string): Promise<void>;
    takeSnapshot(worldId: string): Promise<object>;
    getState(): WorldRuntimeState;
    getUptimeMs(): number;
    getTickCount(): number;
    incrementTick(): void;
    getWorkers(): readonly IWorldWorker[];
    getHealthChecks(): readonly IWorldHealthCheck[];
    getSaga(): IWorldSimulationSaga | null;
    getOpenApi(): IWorldEngineOpenApi | null;
    getSecurity(): IWorldEngineSecurity | null;
    getAcl(): IWorldEngineAclTranslator | null;
    getEngine(): IWorldEngine;
    getConfiguration(): RuntimeConfiguration;
    isShutdownRequested(): boolean;
}
