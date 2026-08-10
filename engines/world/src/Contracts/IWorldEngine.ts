import type { IEventBus } from "@nova-x-ai/core";
import type { IWorldRepository } from "../Domain/Repositories/IWorldRepository";
import type { IWorldClockRepository } from "../Domain/Repositories/IWorldClockRepository";
import type { IRegionRegistryRepository } from "../Domain/Repositories/IRegionRegistryRepository";
import type { IWorldEventStoreRepository } from "../Domain/Repositories/IWorldEventStoreRepository";
import type { ITimeSimulationService } from "../Domain/Services/ITimeSimulationService";
import type { IEnvironmentalSimulationService } from "../Domain/Services/IEnvironmentalSimulationService";
import type { ISpatialContextBuilder } from "../Domain/Services/ISpatialContextBuilder";
import type { IWorldSnapshotManager } from "../Domain/Services/IWorldSnapshotManager";

export interface IWorldEngine {
    readonly eventBus: IEventBus;
    readonly worldRepository: IWorldRepository;
    readonly clockRepository: IWorldClockRepository;
    readonly regionRegistryRepository: IRegionRegistryRepository;
    readonly eventStoreRepository: IWorldEventStoreRepository;
    readonly timeSimulationService: ITimeSimulationService;
    readonly environmentalSimulationService: IEnvironmentalSimulationService;
    readonly spatialContextBuilder: ISpatialContextBuilder;
    readonly snapshotManager: IWorldSnapshotManager;

    initializeWorld(worldId: string, name: string): Promise<void>;
    advanceTime(worldId: string, secondsToAdvance: number): Promise<void>;
    updateWeather(worldId: string, regionId: string, conditions: {
        temperatureCelsius: number;
        precipitationMm: number;
        windSpeedKmh: number;
        cloudCoverPercent: number;
        description: string;
    }): Promise<void>;
    updateNpcPresence(worldId: string, characterId: string, locationId: string, action: "arrived" | "departed"): Promise<void>;
    setGlobalVariable(worldId: string, key: string, value: unknown, type: string): Promise<void>;
    transitionWorldState(worldId: string, targetState: string): Promise<void>;
    takeSnapshot(worldId: string): Promise<object>;
    getWorldState(worldId: string): Promise<{ state: string; version: number } | null>;
    shutdown(): Promise<void>;
}
