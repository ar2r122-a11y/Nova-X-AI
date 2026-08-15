import type { IEventBus } from "@nova-x-ai/core";
import { RelationshipEngine } from "@nova-x-ai/relationship";
import { getSharedStorageEngine } from "./SharedInfrastructure";

export class RelationshipEngineClient {
    private static instance: RelationshipEngine | null = null;
    private static initPromise: Promise<RelationshipEngine | null> | null = null;

    static async getEngine(): Promise<RelationshipEngine | null> {
        if (RelationshipEngineClient.instance) {
            return RelationshipEngineClient.instance;
        }
        if (RelationshipEngineClient.initPromise) {
            return RelationshipEngineClient.initPromise;
        }

        RelationshipEngineClient.initPromise = RelationshipEngineClient.createEngine();
        try {
            RelationshipEngineClient.instance = await RelationshipEngineClient.initPromise;
            return RelationshipEngineClient.instance;
        } catch {
            RelationshipEngineClient.instance = null;
            RelationshipEngineClient.initPromise = null;
            return null;
        }
    }

    private static async createEngine(): Promise<RelationshipEngine | null> {
        try {
            const storageEngine = getSharedStorageEngine();
            const eventBus = storageEngine.eventBus as IEventBus;
            const repo = storageEngine.getRepository<any>("relationships");
            const repository = {
                findById: (key: string) => repo.getById(key),
                findByParticipants: async () => null,
                save: (entity: any) => repo.save(entity),
                delete: (key: string) => repo.delete(key),
                exists: (key: string) => repo.exists(key),
                getAll: () => repo.getAll(),
            };
            const engine = new RelationshipEngine(eventBus, repository as any);
            await engine.initialize();
            return engine;
        } catch {
            return null;
        }
    }

    static async reset(): Promise<void> {
        if (RelationshipEngineClient.instance) {
            try {
                await RelationshipEngineClient.instance.shutdown();
            } catch {
                // ignore shutdown errors
            }
            RelationshipEngineClient.instance = null;
            RelationshipEngineClient.initPromise = null;
        }
    }
}
