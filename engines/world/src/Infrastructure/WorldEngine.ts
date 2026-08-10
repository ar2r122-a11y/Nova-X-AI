import type { IEventBus } from "@nova-x-ai/core";
import type { IWorldRepository } from "../Domain/Repositories/IWorldRepository";
import type { IWorldClockRepository } from "../Domain/Repositories/IWorldClockRepository";
import type { IRegionRegistryRepository } from "../Domain/Repositories/IRegionRegistryRepository";
import type { IWorldEventStoreRepository } from "../Domain/Repositories/IWorldEventStoreRepository";
import type { ITimeSimulationService } from "../Domain/Services/ITimeSimulationService";
import type { IEnvironmentalSimulationService } from "../Domain/Services/IEnvironmentalSimulationService";
import type { ISpatialContextBuilder } from "../Domain/Services/ISpatialContextBuilder";
import type { IWorldSnapshotManager } from "../Domain/Services/IWorldSnapshotManager";
import { IWorldEngine } from "../Contracts/IWorldEngine";
import { WorldAggregate } from "../Domain/Aggregates/WorldAggregate";
import { WorldClockAggregate } from "../Domain/Aggregates/WorldClockAggregate";
import { RegionRegistryAggregate } from "../Domain/Aggregates/RegionRegistryAggregate";
import { WorldEventStoreAggregate } from "../Domain/Aggregates/WorldEventStoreAggregate";
import { WorldId } from "../Domain/ValueObjects/WorldId";
import { WorldStateRef } from "../Domain/ValueObjects/WorldState";
import { RegionId } from "../Domain/ValueObjects/RegionId";
import { LocationId } from "../Domain/ValueObjects/LocationId";
import { GlobalVariableKey } from "../Domain/ValueObjects/GlobalVariableKey";
import { GlobalVariableValue } from "../Domain/ValueObjects/GlobalVariableValue";
import { WeatherCondition } from "../Domain/ValueObjects/WeatherCondition";
import {
    WorldInitializedEvent,
    TimeAdvancedEvent,
    WeatherChangedEvent,
    NpcPresenceUpdatedEvent,
    GlobalVariableUpdatedEvent
} from "../Domain/Events";

export class WorldEngine implements IWorldEngine {
    readonly eventBus: IEventBus;
    readonly worldRepository: IWorldRepository;
    readonly clockRepository: IWorldClockRepository;
    readonly regionRegistryRepository: IRegionRegistryRepository;
    readonly eventStoreRepository: IWorldEventStoreRepository;
    readonly timeSimulationService: ITimeSimulationService;
    readonly environmentalSimulationService: IEnvironmentalSimulationService;
    readonly spatialContextBuilder: ISpatialContextBuilder;
    readonly snapshotManager: IWorldSnapshotManager;

    constructor(
        eventBus: IEventBus,
        worldRepository: IWorldRepository,
        clockRepository: IWorldClockRepository,
        regionRegistryRepository: IRegionRegistryRepository,
        eventStoreRepository: IWorldEventStoreRepository,
        timeSimulationService: ITimeSimulationService,
        environmentalSimulationService: IEnvironmentalSimulationService,
        spatialContextBuilder: ISpatialContextBuilder,
        snapshotManager: IWorldSnapshotManager
    ) {
        this.eventBus = eventBus;
        this.worldRepository = worldRepository;
        this.clockRepository = clockRepository;
        this.regionRegistryRepository = regionRegistryRepository;
        this.eventStoreRepository = eventStoreRepository;
        this.timeSimulationService = timeSimulationService;
        this.environmentalSimulationService = environmentalSimulationService;
        this.spatialContextBuilder = spatialContextBuilder;
        this.snapshotManager = snapshotManager;
    }

    async initializeWorld(worldId: string, name: string): Promise<void> {
        const worldIdVo = WorldId.create(worldId);
        const correlationId = `world-init-${Date.now()}`;

        const worldAggregate = WorldAggregate.create(worldIdVo, name);
        const clockAggregate = WorldClockAggregate.create(worldIdVo);
        const regionRegistryAggregate = RegionRegistryAggregate.create(worldIdVo);
        const eventStoreAggregate = WorldEventStoreAggregate.create(worldIdVo);

        await this.worldRepository.save(worldAggregate);
        await this.clockRepository.save(clockAggregate);
        await this.regionRegistryRepository.save(regionRegistryAggregate);
        await this.eventStoreRepository.save(eventStoreAggregate);

        const events = worldAggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        worldAggregate.commitEvents();
    }

    async advanceTime(worldId: string, secondsToAdvance: number): Promise<void> {
        const worldIdVo = WorldId.create(worldId);
        const correlationId = `world-advance-${Date.now()}`;

        const clockAggregate = await this.clockRepository.findByWorldId(worldIdVo);
        if (!clockAggregate) {
            throw new Error(`World clock not found: ${worldId}`);
        }

        this.validateVersion(clockAggregate.getVersion());

        clockAggregate.advanceTime(secondsToAdvance);
        await this.clockRepository.save(clockAggregate);

        const events = clockAggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        clockAggregate.commitEvents();
    }

    async updateWeather(worldId: string, regionId: string, conditions: {
        temperatureCelsius: number;
        precipitationMm: number;
        windSpeedKmh: number;
        cloudCoverPercent: number;
        description: string;
    }): Promise<void> {
        const worldIdVo = WorldId.create(worldId);
        const correlationId = `world-weather-${Date.now()}`;

        const weatherCondition = WeatherCondition.create(
            conditions.temperatureCelsius,
            conditions.precipitationMm,
            conditions.windSpeedKmh,
            conditions.cloudCoverPercent,
            conditions.description
        );

        await this.environmentalSimulationService.updateWeather(worldId, regionId, weatherCondition);

        const event = new WeatherChangedEvent(
            worldId,
            regionId,
            "",
            weatherCondition.getDescription(),
            0,
            conditions.temperatureCelsius,
            Date.now(),
            correlationId
        );
        await this.eventBus.publish(event);
    }

    async transitionWorldState(worldId: string, targetState: string): Promise<void> {
        const worldIdVo = WorldId.create(worldId);
        const correlationId = `world-transition-${Date.now()}`;

        const worldAggregate = await this.worldRepository.findById(worldIdVo);
        if (!worldAggregate) {
            throw new Error(`World not found: ${worldId}`);
        }

        this.validateVersion(worldAggregate.getVersion());

        const targetStateRef = WorldStateRef.create(targetState as any);

        switch (targetStateRef.getValue()) {
            case "active":
                worldAggregate.activate();
                break;
            case "simulation_running":
                worldAggregate.startSimulation();
                break;
            case "time_paused":
                worldAggregate.pauseTime();
                break;
            case "environmental_shift":
                worldAggregate.enterEnvironmentalShift();
                break;
            case "archived":
                worldAggregate.archive();
                break;
            default:
                throw new Error(`Invalid target state: ${targetState}`);
        }

        await this.worldRepository.save(worldAggregate);

        const events = worldAggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        worldAggregate.commitEvents();
    }

    async updateNpcPresence(worldId: string, characterId: string, locationId: string, action: "arrived" | "departed"): Promise<void> {
        const worldIdVo = WorldId.create(worldId);
        const correlationId = `world-npc-${Date.now()}`;

        const regionRegistryAggregate = await this.regionRegistryRepository.findByWorldId(worldIdVo);
        if (!regionRegistryAggregate) {
            throw new Error(`Region registry not found: ${worldId}`);
        }

        this.validateVersion(regionRegistryAggregate.getVersion());

        regionRegistryAggregate.updateNpcPresence(characterId, LocationId.create(locationId), action, Date.now());
        await this.regionRegistryRepository.save(regionRegistryAggregate);

        const events = regionRegistryAggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        regionRegistryAggregate.commitEvents();
    }

    async setGlobalVariable(worldId: string, key: string, value: unknown, type: string): Promise<void> {
        const worldIdVo = WorldId.create(worldId);
        const correlationId = `world-globalvar-${Date.now()}`;

        const worldAggregate = await this.worldRepository.findById(worldIdVo);
        if (!worldAggregate) {
            throw new Error(`World not found: ${worldId}`);
        }

        this.validateVersion(worldAggregate.getVersion());

        const keyVo = GlobalVariableKey.create(key);
        const valueVo = GlobalVariableValue.create(value, type);
        worldAggregate.setGlobalVariable(keyVo, valueVo);

        await this.worldRepository.save(worldAggregate);

        const events = worldAggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        worldAggregate.commitEvents();
    }

    async takeSnapshot(worldId: string): Promise<object> {
        const worldIdVo = WorldId.create(worldId);
        return this.snapshotManager.takeSnapshot(worldId);
    }

    async getWorldState(worldId: string): Promise<{ state: string; version: number } | null> {
        const worldIdVo = WorldId.create(worldId);
        const worldAggregate = await this.worldRepository.findById(worldIdVo);
        if (!worldAggregate) {
            return null;
        }
        return {
            state: worldAggregate.getWorldState().getValue(),
            version: worldAggregate.getVersion().getValue()
        };
    }

    async shutdown(): Promise<void> {
    }

    private validateVersion(version: { getValue(): number }): void {
        const versionValue = version.getValue();
        if (versionValue < 0) {
            throw new Error(`Invalid aggregate version: ${versionValue}`);
        }
    }
}
