import type { IWorldRepository } from "../../Domain/Repositories/IWorldRepository";
import type { IWorldClockRepository } from "../../Domain/Repositories/IWorldClockRepository";
import type { IRegionRegistryRepository } from "../../Domain/Repositories/IRegionRegistryRepository";
import type { IWorldEventStoreRepository } from "../../Domain/Repositories/IWorldEventStoreRepository";

export class WorldRepositoryRegistry {
    private readonly repositories = new Map<string, IWorldRepository | IWorldClockRepository | IRegionRegistryRepository | IWorldEventStoreRepository>();

    register<T extends IWorldRepository | IWorldClockRepository | IRegionRegistryRepository | IWorldEventStoreRepository>(collection: string, repository: T): void {
        this.repositories.set(collection, repository);
    }

    get<T extends IWorldRepository | IWorldClockRepository | IRegionRegistryRepository | IWorldEventStoreRepository>(collection: string): T | undefined {
        return this.repositories.get(collection) as T | undefined;
    }

    has(collection: string): boolean {
        return this.repositories.has(collection);
    }

    clear(): void {
        this.repositories.clear();
    }
}
