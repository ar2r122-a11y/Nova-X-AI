import { IDomainEvent } from "@nova-x-ai/core";
import { WorldId } from "../ValueObjects/WorldId";
import { RegionId } from "../ValueObjects/RegionId";
import { LocationId } from "../ValueObjects/LocationId";
import { Region } from "../Entities/Region";
import { Location } from "../Entities/Location";
import { NpcPresenceEntry } from "../Entities/NpcPresenceEntry";
import { NpcPresenceUpdatedEvent } from "../Events";
import { WorldEventVersion } from "../ValueObjects/WorldEventVersion";
import { WorldHistoryEntry } from "../Entities/WorldHistoryEntry";

export class RegionRegistryAggregate {
    private readonly worldId: WorldId;
    private readonly regions: Map<string, Region>;
    private readonly locations: Map<string, Location>;
    private readonly npcPresences: Map<string, NpcPresenceEntry[]>;
    private version: WorldEventVersion;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(
        worldId: WorldId,
        regions: Map<string, Region>,
        locations: Map<string, Location>,
        npcPresences: Map<string, NpcPresenceEntry[]>,
        version: WorldEventVersion
    ) {
        this.worldId = worldId;
        this.regions = regions;
        this.locations = locations;
        this.npcPresences = npcPresences;
        this.version = version;
        this.uncommittedEvents = [];
    }

    static create(worldId: WorldId): RegionRegistryAggregate {
        return new RegionRegistryAggregate(worldId, new Map(), new Map(), new Map(), WorldEventVersion.initial());
    }

    static reconstitute(
        worldId: WorldId,
        regions: Map<string, Region>,
        locations: Map<string, Location>,
        npcPresences: Map<string, NpcPresenceEntry[]>,
        version: WorldEventVersion
    ): RegionRegistryAggregate {
        return new RegionRegistryAggregate(worldId, regions, locations, npcPresences, version);
    }

    getWorldId(): WorldId {
        return this.worldId;
    }

    getVersion(): WorldEventVersion {
        return this.version;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    registerRegion(region: Region): void {
        const regionIdValue = region.getId().getValue();
        if (this.regions.has(regionIdValue)) {
            throw new Error(`Region already registered: ${regionIdValue}`);
        }
        this.regions.set(regionIdValue, region);
        this.version = WorldEventVersion.next(this.version);
    }

    unregisterRegion(regionId: RegionId): void {
        const regionIdValue = regionId.getValue();
        if (!this.regions.has(regionIdValue)) {
            throw new Error(`Region not found: ${regionIdValue}`);
        }
        this.regions.delete(regionIdValue);
        this.version = WorldEventVersion.next(this.version);
    }

    registerLocation(location: Location): void {
        const region = this.regions.get(location.getRegionId().getValue());
        if (!region) {
            throw new Error(`Region not found for location: ${location.getRegionId().getValue()}`);
        }
        if (!region.hasLocation(location.getId().getValue())) {
            throw new Error(`Location ${location.getId().getValue()} is not part of region ${location.getRegionId().getValue()}`);
        }

        const locationIdValue = location.getId().getValue();
        if (this.locations.has(locationIdValue)) {
            throw new Error(`Location already registered: ${locationIdValue}`);
        }
        this.locations.set(locationIdValue, location);
        this.version = WorldEventVersion.next(this.version);
    }

    getRegion(regionId: RegionId): Region | undefined {
        return this.regions.get(regionId.getValue());
    }

    getLocation(locationId: LocationId): Location | undefined {
        return this.locations.get(locationId.getValue());
    }

    getAllRegions(): readonly Region[] {
        return Array.from(this.regions.values());
    }

    getAllLocations(): readonly Location[] {
        return Array.from(this.locations.values());
    }

    updateNpcPresence(characterId: string, locationId: LocationId, action: "arrived" | "departed", timestamp: number): void {
        if (!this.locations.has(locationId.getValue())) {
            throw new Error(`Location not found: ${locationId.getValue()}`);
        }

        const previousLocationId = this.findCurrentLocationId(characterId);

        if (action === "arrived") {
            const existingPresences = this.npcPresences.get(characterId) || [];
            const activePresence = existingPresences.find(p => p.isPresentAt(timestamp));
            if (activePresence) {
                throw new Error(`NPC ${characterId} is already present at location ${activePresence.getLocationId().getValue()}`);
            }
            const newEntry = NpcPresenceEntry.create(characterId, locationId, timestamp, null);
            this.npcPresences.set(characterId, [...existingPresences, newEntry]);
        } else {
            const existingPresences = this.npcPresences.get(characterId) || [];
            const activeIndex = existingPresences.findIndex(p => p.getLocationId().equals(locationId) && p.isPresentAt(timestamp));
            if (activeIndex === -1) {
                throw new Error(`NPC ${characterId} is not present at location ${locationId.getValue()}`);
            }
            const updated = existingPresences.map((p, i) =>
                i === activeIndex ? NpcPresenceEntry.create(p.getCharacterId(), p.getLocationId(), p.getArrivedAt(), timestamp) : p
            );
            this.npcPresences.set(characterId, updated);
        }

        this.version = WorldEventVersion.next(this.version);

        this.uncommittedEvents.push(new NpcPresenceUpdatedEvent(
            this.worldId.getValue(),
            characterId,
            locationId.getValue(),
            previousLocationId,
            action,
            Date.now(),
            ""
        ));
    }

    getNpcPresenceAtLocation(locationId: LocationId, timestamp: number): readonly string[] {
        const result: string[] = [];
        for (const [characterId, presences] of this.npcPresences.entries()) {
            if (presences.some(p => p.getLocationId().equals(locationId) && p.isPresentAt(timestamp))) {
                result.push(characterId);
            }
        }
        return result;
    }

    findCurrentLocationId(characterId: string): string | null {
        const presences = this.npcPresences.get(characterId);
        if (!presences) return null;
        const now = Date.now();
        const active = presences.find(p => p.isPresentAt(now));
        return active ? active.getLocationId().getValue() : null;
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): object {
        const regionsSnapshot = Array.from(this.regions.values()).map(r => ({
            id: r.getId().getValue(),
            name: r.getName(),
            description: r.getDescription(),
            locationIds: r.getLocationIds()
        }));

        const locationsSnapshot = Array.from(this.locations.values()).map(l => ({
            id: l.getId().getValue(),
            regionId: l.getRegionId().getValue(),
            name: l.getName(),
            description: l.getDescription(),
            coordinate: { x: l.getCoordinate().getX(), y: l.getCoordinate().getY(), z: l.getCoordinate().getZ() },
            capacity: l.getCapacity()
        }));

        const npcPresencesSnapshot = Array.from(this.npcPresences.entries()).map(([charId, entries]) => ({
            characterId: charId,
            entries: entries.map(e => ({
                locationId: e.getLocationId().getValue(),
                arrivedAt: e.getArrivedAt(),
                scheduledDeparture: e.getScheduledDeparture()
            }))
        }));

        return {
            worldId: this.worldId.getValue(),
            regions: regionsSnapshot,
            locations: locationsSnapshot,
            npcPresences: npcPresencesSnapshot,
            version: this.version.getValue()
        };
    }
}
