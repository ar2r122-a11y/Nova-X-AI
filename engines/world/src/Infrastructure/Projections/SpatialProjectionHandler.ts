import { IEventHandler } from "@nova-x-ai/core";
import { NpcPresenceUpdatedEvent } from "../../Domain/Events";
import { IProjectionStore } from "@nova-x-ai/storage";

export interface SpatialProjection {
    readonly worldId: string;
    readonly locationId: string;
    readonly presentNpcs: string[];
    readonly updatedAt: number;
}

export class SpatialProjectionHandler implements IEventHandler<NpcPresenceUpdatedEvent> {
    private readonly projectionName = "spatial-projection";

    constructor(private readonly projectionStore: IProjectionStore) {}

    async handle(event: NpcPresenceUpdatedEvent): Promise<void> {
        const projection: SpatialProjection = {
            worldId: event.worldId,
            locationId: event.locationId,
            presentNpcs: event.action === "arrived"
                ? [...(await this.getPresentNpcs(event.worldId, event.locationId)), event.characterId]
                : (await this.getPresentNpcs(event.worldId, event.locationId)).filter(id => id !== event.characterId),
            updatedAt: event.timestamp
        };
        await this.projectionStore.saveProjection(`${this.projectionName}:${event.worldId}:${event.locationId}`, projection);
    }

    private async getPresentNpcs(worldId: string, locationId: string): Promise<string[]> {
        const data = await this.projectionStore.getProjection(`${this.projectionName}:${worldId}:${locationId}`);
        const projection = data as SpatialProjection | undefined;
        return projection?.presentNpcs ?? [];
    }
}
