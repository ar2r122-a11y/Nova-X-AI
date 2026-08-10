import type { IStorageEngine } from "@nova-x-ai/storage";
import { WorldRepositoryImpl } from "./WorldRepositoryImpl";
import { WorldClockRepositoryImpl } from "./WorldClockRepositoryImpl";
import { RegionRegistryRepositoryImpl } from "./RegionRegistryRepositoryImpl";
import { WorldEventStoreRepositoryImpl } from "./WorldEventStoreRepositoryImpl";
import type { IWorldRepository } from "../../Domain/Repositories/IWorldRepository";
import type { IWorldClockRepository } from "../../Domain/Repositories/IWorldClockRepository";
import type { IRegionRegistryRepository } from "../../Domain/Repositories/IRegionRegistryRepository";
import type { IWorldEventStoreRepository } from "../../Domain/Repositories/IWorldEventStoreRepository";

export class WorldRepositoryFactory {
    constructor(private readonly storageEngine: IStorageEngine) {}

    createWorldRepository(): IWorldRepository {
        return new WorldRepositoryImpl(this.storageEngine);
    }

    createWorldClockRepository(): IWorldClockRepository {
        return new WorldClockRepositoryImpl(this.storageEngine);
    }

    createRegionRegistryRepository(): IRegionRegistryRepository {
        return new RegionRegistryRepositoryImpl(this.storageEngine);
    }

    createWorldEventStoreRepository(): IWorldEventStoreRepository {
        return new WorldEventStoreRepositoryImpl(this.storageEngine);
    }
}
