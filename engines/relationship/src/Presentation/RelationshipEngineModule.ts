import { RelationshipEngine } from "../Infrastructure/RelationshipEngine";
import type { IRelationshipEngine } from "../Contracts/IRelationshipEngine";
import type { IEventBus } from "@nova-x-ai/core";
import type { IStorageEngine } from "@nova-x-ai/storage";
import { RelationshipRepositoryImpl } from "../Infrastructure/Persistence/RelationshipRepositoryImpl";

export class RelationshipEngineModule {
    static create(eventBus: IEventBus, storageEngine: IStorageEngine): IRelationshipEngine {
        const repository = new RelationshipRepositoryImpl(storageEngine);
        return new RelationshipEngine(eventBus, repository);
    }
}
