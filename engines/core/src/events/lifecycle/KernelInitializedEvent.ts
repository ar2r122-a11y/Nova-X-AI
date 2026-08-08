import type { IDomainEvent } from "../IEventBus";

export interface KernelInitializedEventPayload {
    readonly timestamp: number;
    readonly registeredModulesCount: number;
    readonly runtimeVersion: string;
}

export class KernelInitializedEvent implements IDomainEvent {
    public readonly eventType = "KernelInitializedEvent";

    public readonly timestamp: number;

    public readonly correlationId: string;

    public readonly registeredModulesCount: number;

    public readonly runtimeVersion: string;

    constructor(
        payload: KernelInitializedEventPayload,
        correlationId: string
    ) {
        this.timestamp = payload.timestamp;
        this.registeredModulesCount =
            payload.registeredModulesCount;
        this.runtimeVersion =
            payload.runtimeVersion;
        this.correlationId = correlationId;
    }
}