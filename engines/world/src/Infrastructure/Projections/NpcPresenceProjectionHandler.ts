import { IEventHandler } from "@nova-x-ai/core";
import { NpcPresenceUpdatedEvent } from "../../Domain/Events";
import { IProjectionStore } from "@nova-x-ai/storage";

export interface NpcPresenceProjection {
    readonly worldId: string;
    readonly characterId: string;
    readonly currentLocationId: string | null;
    readonly lastAction: "arrived" | "departed";
    readonly updatedAt: number;
}

export class NpcPresenceProjectionHandler implements IEventHandler<NpcPresenceUpdatedEvent> {
    private readonly projectionName = "npc-presence-projection";

    constructor(private readonly projectionStore: IProjectionStore) {}

    async handle(event: NpcPresenceUpdatedEvent): Promise<void> {
        const projection: NpcPresenceProjection = {
            worldId: event.worldId,
            characterId: event.characterId,
            currentLocationId: event.action === "arrived" ? event.locationId : event.previousLocationId,
            lastAction: event.action,
            updatedAt: event.timestamp
        };
        await this.projectionStore.saveProjection(`${this.projectionName}:${event.worldId}:${event.characterId}`, projection);
    }
}
