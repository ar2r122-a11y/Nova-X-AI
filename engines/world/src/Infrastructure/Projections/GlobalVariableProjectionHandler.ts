import { IEventHandler } from "@nova-x-ai/core";
import { GlobalVariableUpdatedEvent } from "../../Domain/Events";
import { IProjectionStore } from "@nova-x-ai/storage";

export interface GlobalVariableProjection {
    readonly worldId: string;
    readonly key: string;
    readonly value: unknown;
    readonly previousValue: unknown;
    readonly updatedAt: number;
}

export class GlobalVariableProjectionHandler implements IEventHandler<GlobalVariableUpdatedEvent> {
    private readonly projectionName = "global-variable-projection";

    constructor(private readonly projectionStore: IProjectionStore) {}

    async handle(event: GlobalVariableUpdatedEvent): Promise<void> {
        const projection: GlobalVariableProjection = {
            worldId: event.worldId,
            key: event.key,
            value: event.newValue,
            previousValue: event.previousValue,
            updatedAt: event.timestamp
        };
        await this.projectionStore.saveProjection(`${this.projectionName}:${event.worldId}:${event.key}`, projection);
    }
}
