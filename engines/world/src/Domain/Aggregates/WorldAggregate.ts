import { IDomainEvent } from "@nova-x-ai/core";
import { WorldId } from "../ValueObjects/WorldId";
import { WorldStateRef } from "../ValueObjects/WorldState";
import { WorldEventVersion } from "../ValueObjects/WorldEventVersion";
import { RegionId } from "../ValueObjects/RegionId";
import { GlobalVariableKey } from "../ValueObjects/GlobalVariableKey";
import { GlobalVariableValue } from "../ValueObjects/GlobalVariableValue";
import { WorldHistoryEntry } from "../Entities/WorldHistoryEntry";
import {
    WorldInitializedEvent,
    GlobalVariableUpdatedEvent
} from "../Events";

export class WorldAggregate {
    private readonly worldId: WorldId;
    private worldState: WorldStateRef;
    private readonly regionIds: RegionId[];
    private readonly globalVariables: Map<string, GlobalVariableValue>;
    private readonly history: WorldHistoryEntry[];
    private version: WorldEventVersion;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(
        worldId: WorldId,
        worldState: WorldStateRef,
        regionIds: RegionId[],
        globalVariables: Map<string, GlobalVariableValue>,
        history: WorldHistoryEntry[],
        version: WorldEventVersion
    ) {
        this.worldId = worldId;
        this.worldState = worldState;
        this.regionIds = regionIds;
        this.globalVariables = globalVariables;
        this.history = history;
        this.version = version;
        this.uncommittedEvents = [];
    }

    static create(worldId: WorldId, name: string): WorldAggregate {
        const aggregate = new WorldAggregate(
            worldId,
            WorldStateRef.initialized(),
            [],
            new Map(),
            [],
            WorldEventVersion.initial()
        );

        aggregate.uncommittedEvents.push(new WorldInitializedEvent(worldId.getValue(), name, Date.now(), ""));
        return aggregate;
    }

    static reconstitute(
        worldId: WorldId,
        worldState: WorldStateRef,
        regionIds: RegionId[],
        globalVariables: Map<string, GlobalVariableValue>,
        history: WorldHistoryEntry[],
        version: WorldEventVersion
    ): WorldAggregate {
        return new WorldAggregate(worldId, worldState, regionIds, globalVariables, history, version);
    }

    getWorldId(): WorldId {
        return this.worldId;
    }

    getWorldState(): WorldStateRef {
        return this.worldState;
    }

    getRegionIds(): readonly RegionId[] {
        return this.regionIds;
    }

    getGlobalVariables(): ReadonlyMap<string, GlobalVariableValue> {
        return this.globalVariables;
    }

    getVersion(): WorldEventVersion {
        return this.version;
    }

    getHistory(): readonly WorldHistoryEntry[] {
        return this.history;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    activate(): void {
        if (this.worldState.getValue() !== "initialized") {
            throw new Error(`Cannot activate world from state: ${this.worldState.getValue()}`);
        }
        this.worldState = WorldStateRef.active();
        this.version = WorldEventVersion.next(this.version);
        this.recordHistory("WorldActivated", {});
    }

    startSimulation(): void {
        if (this.worldState.getValue() !== "active" && this.worldState.getValue() !== "time_paused" && this.worldState.getValue() !== "environmental_shift") {
            throw new Error(`Cannot start simulation from state: ${this.worldState.getValue()}`);
        }
        this.worldState = WorldStateRef.simulationRunning();
        this.version = WorldEventVersion.next(this.version);
        this.recordHistory("SimulationStarted", {});
    }

    pauseTime(): void {
        if (this.worldState.getValue() !== "simulation_running") {
            throw new Error(`Cannot pause time from state: ${this.worldState.getValue()}`);
        }
        this.worldState = WorldStateRef.timePaused();
        this.version = WorldEventVersion.next(this.version);
        this.recordHistory("TimePaused", {});
    }

    enterEnvironmentalShift(): void {
        if (this.worldState.getValue() !== "simulation_running") {
            throw new Error(`Cannot enter environmental shift from state: ${this.worldState.getValue()}`);
        }
        this.worldState = WorldStateRef.environmentalShift();
        this.version = WorldEventVersion.next(this.version);
        this.recordHistory("EnvironmentalShiftEntered", {});
    }

    resumeSimulation(): void {
        if (this.worldState.getValue() !== "time_paused" && this.worldState.getValue() !== "environmental_shift") {
            throw new Error(`Cannot resume simulation from state: ${this.worldState.getValue()}`);
        }
        this.worldState = WorldStateRef.simulationRunning();
        this.version = WorldEventVersion.next(this.version);
        this.recordHistory("SimulationResumed", {});
    }

    archive(): void {
        if (this.worldState.getValue() === "archived") {
            throw new Error("World is already archived.");
        }
        this.worldState = WorldStateRef.archived();
        this.version = WorldEventVersion.next(this.version);
        this.recordHistory("WorldArchived", {});
    }

    setGlobalVariable(key: GlobalVariableKey, value: GlobalVariableValue): void {
        const previousValue = this.globalVariables.get(key.getValue());
        this.globalVariables.set(key.getValue(), value);
        this.version = WorldEventVersion.next(this.version);

        this.uncommittedEvents.push(new GlobalVariableUpdatedEvent(
            this.worldId.getValue(),
            key.getValue(),
            previousValue?.getValue() ?? null,
            value.getValue(),
            Date.now(),
            ""
        ));

        this.recordHistory("GlobalVariableUpdated", {
            key: key.getValue(),
            previousValue: previousValue?.getValue() ?? null,
            newValue: value.getValue()
        });
    }

    removeGlobalVariable(key: GlobalVariableKey): void {
        if (!this.globalVariables.has(key.getValue())) {
            throw new Error(`Global variable not found: ${key.getValue()}`);
        }
        const previousValue = this.globalVariables.get(key.getValue());
        this.globalVariables.delete(key.getValue());
        this.version = WorldEventVersion.next(this.version);

        this.uncommittedEvents.push(new GlobalVariableUpdatedEvent(
            this.worldId.getValue(),
            key.getValue(),
            previousValue?.getValue() ?? null,
            null,
            Date.now(),
            ""
        ));

        this.recordHistory("GlobalVariableRemoved", { key: key.getValue() });
    }

    registerRegion(regionId: RegionId): void {
        if (this.regionIds.some(id => id.equals(regionId))) {
            throw new Error(`Region already registered: ${regionId.getValue()}`);
        }
        if (this.regionIds.length >= 10) {
            throw new Error("Maximum number of regions (10) reached.");
        }
        this.regionIds.push(regionId);
        this.version = WorldEventVersion.next(this.version);
        this.recordHistory("RegionRegistered", { regionId: regionId.getValue() });
    }

    unregisterRegion(regionId: RegionId): void {
        const index = this.regionIds.findIndex(id => id.equals(regionId));
        if (index === -1) {
            throw new Error(`Region not found: ${regionId.getValue()}`);
        }
        this.regionIds.splice(index, 1);
        this.version = WorldEventVersion.next(this.version);
        this.recordHistory("RegionUnregistered", { regionId: regionId.getValue() });
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): object {
        return {
            worldId: this.worldId.getValue(),
            worldState: this.worldState.getValue(),
            regionIds: this.regionIds.map(id => id.getValue()),
            globalVariables: Array.from(this.globalVariables.entries()).map(([k, v]) => ({
                key: k,
                value: v.getValue(),
                type: v.getType()
            })),
            history: this.history.map(h => h),
            version: this.version.getValue()
        };
    }

    private recordHistory(eventType: string, payload: Record<string, unknown>): void {
        const entry = WorldHistoryEntry.create(
            this.version,
            eventType,
            Date.now(),
            payload,
            ""
        );
        this.history.push(entry);
    }
}
