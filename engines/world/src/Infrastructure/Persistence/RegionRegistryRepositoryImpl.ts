import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IRegionRegistryRepository } from "../../Domain/Repositories/IRegionRegistryRepository";
import { RegionRegistryAggregate } from "../../Domain/Aggregates/RegionRegistryAggregate";
import { WorldId } from "../../Domain/ValueObjects/WorldId";
import { RegionId } from "../../Domain/ValueObjects/RegionId";
import { LocationId } from "../../Domain/ValueObjects/LocationId";
import { Region } from "../../Domain/Entities/Region";
import { Location } from "../../Domain/Entities/Location";
import { NpcPresenceEntry } from "../../Domain/Entities/NpcPresenceEntry";
import { SpatialCoordinate } from "../../Domain/ValueObjects/SpatialCoordinate";
import { WorldEventVersion } from "../../Domain/ValueObjects/WorldEventVersion";

interface StoredRegionRegistryEntity {
    id: string;
    data: string;
}

export class RegionRegistryRepositoryImpl implements IRegionRegistryRepository {
    private readonly storageRepository: {
        getById(key: string): Promise<StoredRegionRegistryEntity | null>;
        save(entity: StoredRegionRegistryEntity): Promise<void>;
        delete(key: string): Promise<void>;
        exists(key: string): Promise<boolean>;
        getAll(): Promise<StoredRegionRegistryEntity[]>;
    };

    constructor(storageEngine: IStorageEngine) {
        const repo = storageEngine.getRepository<StoredRegionRegistryEntity>("world-regions");
        this.storageRepository = {
            getById: (key) => repo.getById(key),
            save: (entity) => repo.save(entity),
            delete: (key) => repo.delete(key),
            exists: (key) => repo.exists(key),
            getAll: () => repo.getAll()
        };
    }

    async findByWorldId(worldId: WorldId): Promise<RegionRegistryAggregate | null> {
        const entity = await this.storageRepository.getById(worldId.getValue());
        if (!entity) {
            return null;
        }
        const snapshot = JSON.parse(entity.data);
        return this.reconstitute(snapshot);
    }

    async save(aggregate: RegionRegistryAggregate): Promise<void> {
        const snapshot = aggregate.getSnapshot();
        const serialized = JSON.stringify(snapshot);
        const entity: StoredRegionRegistryEntity = {
            id: aggregate.getWorldId().getValue(),
            data: serialized
        };
        await this.storageRepository.save(entity);
    }

    private reconstitute(snapshot: any): RegionRegistryAggregate {
        const worldId = WorldId.fromString(snapshot.worldId);

        const regions = new Map<string, Region>();
        for (const r of snapshot.regions as any[]) {
            const region = Region.create(
                RegionId.create(r.id),
                r.name,
                r.description,
                SpatialCoordinate.origin(),
                SpatialCoordinate.origin(),
                r.locationIds
            );
            regions.set(r.id, region);
        }

        const locations = new Map<string, Location>();
        for (const l of snapshot.locations as any[]) {
            const location = Location.create(
                LocationId.create(l.id),
                RegionId.create(l.regionId),
                l.name,
                l.description,
                SpatialCoordinate.create(l.coordinate.x, l.coordinate.y, l.coordinate.z),
                l.capacity
            );
            locations.set(l.id, location);
        }

        const npcPresences = new Map<string, NpcPresenceEntry[]>();
        for (const p of snapshot.npcPresences as any[]) {
            const entries = p.entries.map((e: any) =>
                NpcPresenceEntry.create(
                    p.characterId,
                    LocationId.create(e.locationId),
                    e.arrivedAt,
                    e.scheduledDeparture
                )
            );
            npcPresences.set(p.characterId, entries);
        }

        const version = WorldEventVersion.create(snapshot.version);
        return RegionRegistryAggregate.reconstitute(worldId, regions, locations, npcPresences, version);
    }
}
