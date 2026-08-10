import type { WorldState } from "../../Domain/ValueObjects/WorldState";

export interface IWorldSimulationSaga {
    readonly sagaId: string;
    readonly correlationId: string;
    readonly causationId: string | null;
    start(worldId: string, targetState: WorldState): Promise<void>;
    executeStep(step: SagaStep): Promise<void>;
    compensate(step: SagaStep): Promise<void>;
    complete(): Promise<void>;
    fail(reason: string): Promise<void>;
    getProcessState(): SagaProcessState;
}

export type SagaProcessState = "not_started" | "running" | "compensating" | "completed" | "failed" | "abandoned";

export interface SagaStep {
    stepId: string;
    name: string;
    action: SagaAction;
    compensationAction?: SagaAction;
    executed: boolean;
    compensated: boolean;
}

export interface SagaAction {
    readonly type: string;
    readonly payload: Record<string, unknown>;
}

export interface SagaResult {
    readonly sagaId: string;
    readonly success: boolean;
    readonly state: SagaProcessState;
    readonly compensatedSteps: string[];
    readonly error?: string;
    readonly timestamp: number;
}
