import { IEventHandler, IDomainEvent } from "@nova-x-ai/core";
import { WorldInitializedEvent, TimeAdvancedEvent, WeatherChangedEvent, NpcPresenceUpdatedEvent, GlobalVariableUpdatedEvent } from "../../Domain/Events";
import { IProjectionStore } from "@nova-x-ai/storage";

export interface WorldStateProjection {
    readonly worldId: string;
    readonly state: string;
    readonly regionCount: number;
    readonly globalVariableCount: number;
    readonly tickCount: number;
    readonly lastUpdated: number;
}

export class WorldStateProjectionHandler {
    private readonly projectionName = "world-state-projection";

    constructor(private readonly projectionStore: IProjectionStore) {}

    createWorldInitializedHandler(): IEventHandler<WorldInitializedEvent> {
        return {
            handle: async (event: WorldInitializedEvent): Promise<void> => {
                const projection: WorldStateProjection = {
                    worldId: event.worldId,
                    state: "initialized",
                    regionCount: 0,
                    globalVariableCount: 0,
                    tickCount: 0,
                    lastUpdated: event.timestamp
                };
                await this.projectionStore.saveProjection(`${this.projectionName}:${event.worldId}`, projection);
            }
        };
    }

    createTimeAdvancedHandler(): IEventHandler<TimeAdvancedEvent> {
        return {
            handle: async (event: TimeAdvancedEvent): Promise<void> => {
                await this.update(event.worldId, current => ({
                    ...current,
                    tickCount: current.tickCount + 1,
                    lastUpdated: event.timestamp
                }));
            }
        };
    }

    createWeatherChangedHandler(): IEventHandler<WeatherChangedEvent> {
        return {
            handle: async (event: WeatherChangedEvent): Promise<void> => {
                const current = await this.get(event.worldId);
                await this.update(event.worldId, () => ({ ...current, lastUpdated: event.timestamp }));
            }
        };
    }

    createNpcPresenceUpdatedHandler(): IEventHandler<NpcPresenceUpdatedEvent> {
        return {
            handle: async (event: NpcPresenceUpdatedEvent): Promise<void> => {
                const current = await this.get(event.worldId);
                await this.update(event.worldId, () => ({ ...current, lastUpdated: event.timestamp }));
            }
        };
    }

    createGlobalVariableUpdatedHandler(): IEventHandler<GlobalVariableUpdatedEvent> {
        return {
            handle: async (event: GlobalVariableUpdatedEvent): Promise<void> => {
                await this.update(event.worldId, current => ({
                    ...current,
                    globalVariableCount: current.globalVariableCount + 1,
                    lastUpdated: event.timestamp
                }));
            }
        };
    }

    private async get(worldId: string): Promise<WorldStateProjection> {
        const data = await this.projectionStore.getProjection(`${this.projectionName}:${worldId}`);
        return (data as WorldStateProjection) ?? {
            worldId,
            state: "unknown",
            regionCount: 0,
            globalVariableCount: 0,
            tickCount: 0,
            lastUpdated: Date.now()
        };
    }

    private async update(worldId: string, updater: (current: WorldStateProjection) => WorldStateProjection): Promise<void> {
        const current = await this.get(worldId);
        const updated = updater(current);
        await this.projectionStore.saveProjection(`${this.projectionName}:${worldId}`, updated);
    }
}
