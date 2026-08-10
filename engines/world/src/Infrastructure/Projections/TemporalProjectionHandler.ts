import { IEventHandler } from "@nova-x-ai/core";
import { TimeAdvancedEvent } from "../../Domain/Events";
import { IProjectionStore } from "@nova-x-ai/storage";

export interface TemporalProjection {
    readonly worldId: string;
    readonly currentTime: number;
    readonly currentDate: string;
    readonly currentSeason: string;
    readonly tickCount: number;
}

export class TemporalProjectionHandler implements IEventHandler<TimeAdvancedEvent> {
    private readonly projectionName = "temporal-projection";

    constructor(private readonly projectionStore: IProjectionStore) {}

    async handle(event: TimeAdvancedEvent): Promise<void> {
        const projection: TemporalProjection = {
            worldId: event.worldId,
            currentTime: event.newTime,
            currentDate: event.newDate,
            currentSeason: event.newSeason,
            tickCount: 0
        };
        await this.projectionStore.saveProjection(`${this.projectionName}:${event.worldId}`, projection);
    }
}
