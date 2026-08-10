import { IEventBus } from "@nova-x-ai/core";
import type { SagaProcessState, SagaStep, SagaAction, SagaResult } from "../../Contracts/Saga/index";

export class WorldSimulationSaga {
    readonly sagaId: string;
    readonly correlationId: string;
    readonly causationId: string | null;
    private state: SagaProcessState = "not_started";
    private readonly steps: Map<string, SagaStep> = new Map();
    private readonly eventBus: IEventBus;

    constructor(eventBus: IEventBus) {
        this.eventBus = eventBus;
        this.sagaId = `world-saga-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        this.correlationId = this.sagaId;
        this.causationId = null;
    }

    async start(_worldId: string, _targetState: string): Promise<void> {
        if (this.state !== "not_started") {
            return Promise.resolve();
        }
        this.state = "running";
    }

    async executeStep(step: SagaStep): Promise<void> {
        if (this.state !== "running") {
            throw new Error(`Cannot execute step when saga state is: ${this.state}`);
        }

        this.steps.set(step.stepId, { ...step, executed: true, compensated: false });

        try {
            await this.eventBus.publish({
                eventType: `EVT_WORLD_SagaStepExecuted_${step.name}`,
                timestamp: Date.now(),
                correlationId: this.correlationId,
                payload: {
                    sagaId: this.sagaId,
                    stepId: step.stepId,
                    action: step.action
                }
            } as unknown as import("@nova-x-ai/core").IDomainEvent);
        } catch {
            throw new Error(`Failed to publish saga step event: ${step.stepId}`);
        }
    }

    async compensate(step: SagaStep): Promise<void> {
        if (this.state !== "running" && this.state !== "compensating") {
            throw new Error(`Cannot compensate step when saga state is: ${this.state}`);
        }

        this.state = "compensating";

        const registered = this.steps.get(step.stepId);
        if (registered) {
            registered.executed = false;
            registered.compensated = true;
        }

        if (step.compensationAction) {
            try {
                await this.eventBus.publish({
                    eventType: `EVT_WORLD_SagaStepCompensated_${step.name}`,
                    timestamp: Date.now(),
                    correlationId: this.correlationId,
                    payload: {
                        sagaId: this.sagaId,
                        stepId: step.stepId,
                        compensationAction: step.compensationAction
                    }
                } as unknown as import("@nova-x-ai/core").IDomainEvent);
            } catch {
                throw new Error(`Failed to publish saga compensation event: ${step.stepId}`);
            }
        }
    }

    async complete(): Promise<void> {
        if (this.state !== "running" && this.state !== "compensating") {
            return;
        }
        this.state = "completed";

        await this.eventBus.publish({
            eventType: "EVT_WORLD_SagaCompleted",
            timestamp: Date.now(),
            correlationId: this.correlationId,
            payload: {
                sagaId: this.sagaId,
                stepsExecuted: Array.from(this.steps.values()).filter(s => s.executed).length,
                stepsCompensated: Array.from(this.steps.values()).filter(s => s.compensated).length
            }
        } as unknown as import("@nova-x-ai/core").IDomainEvent);
    }

    async fail(reason: string): Promise<void> {
        if (this.state === "completed" || this.state === "abandoned") {
            return;
        }

        const uncompensatedSteps = Array.from(this.steps.values()).filter(s => s.executed && !s.compensated);
        for (const step of uncompensatedSteps.reverse()) {
            try {
                await this.compensate(step);
            } catch {
                break;
            }
        }

        this.state = "failed";

        await this.eventBus.publish({
            eventType: "EVT_WORLD_SagaFailed",
            timestamp: Date.now(),
            correlationId: this.correlationId,
            payload: {
                sagaId: this.sagaId,
                reason,
                stepsCompensated: Array.from(this.steps.values()).filter(s => s.compensated).map(s => s.stepId)
            }
        } as unknown as import("@nova-x-ai/core").IDomainEvent);
    }

    getProcessState(): SagaProcessState {
        return this.state;
    }

    getResult(): SagaResult {
        return {
            sagaId: this.sagaId,
            success: this.state === "completed",
            state: this.state,
            compensatedSteps: Array.from(this.steps.values()).filter(s => s.compensated).map(s => s.stepId),
            timestamp: Date.now()
        };
    }
}
