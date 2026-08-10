import type { IWorldRepository } from "../../Domain/Repositories/IWorldRepository";
import type { IWorldClockRepository } from "../../Domain/Repositories/IWorldClockRepository";
import type { IRegionRegistryRepository } from "../../Domain/Repositories/IRegionRegistryRepository";
import type { IWorldEventStoreRepository } from "../../Domain/Repositories/IWorldEventStoreRepository";
import { WorldRepositoryRegistry } from "./WorldRepositoryRegistry";

export class WorldRepositoryResolver {
    constructor(private readonly registry: WorldRepositoryRegistry) {}

    resolveWorldRepository(): IWorldRepository {
        const repository = this.registry.get<IWorldRepository>("worlds");
        if (!repository) {
            throw new Error("World repository not registered.");
        }
        return repository;
    }

    resolveWorldClockRepository(): IWorldClockRepository {
        const repository = this.registry.get<IWorldClockRepository>("world-clocks");
        if (!repository) {
            throw new Error("World clock repository not registered.");
        }
        return repository;
    }

    resolveRegionRegistryRepository(): IRegionRegistryRepository {
        const repository = this.registry.get<IRegionRegistryRepository>("world-regions");
        if (!repository) {
            throw new Error("Region registry repository not registered.");
        }
        return repository;
    }

    resolveWorldEventStoreRepository(): IWorldEventStoreRepository {
        const repository = this.registry.get<IWorldEventStoreRepository>("world-event-stores");
        if (!repository) {
            throw new Error("World event store repository not registered.");
        }
        return repository;
    }
}
