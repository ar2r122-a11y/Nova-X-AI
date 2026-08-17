import type { IEventBus } from "@nova-x-ai/core";
import { EmotionEngine } from "@nova-x-ai/emotion";
import { getSharedStorageEngine } from "./SharedInfrastructure";

export class EmotionEngineClient {
    private static instance: EmotionEngine | null = null;
    private static initPromise: Promise<EmotionEngine | null> | null = null;

    static async getEngine(): Promise<EmotionEngine | null> {
        if (EmotionEngineClient.instance) {
            return EmotionEngineClient.instance;
        }
        if (EmotionEngineClient.initPromise) {
            return EmotionEngineClient.initPromise;
        }

        EmotionEngineClient.initPromise = EmotionEngineClient.createEngine();
        try {
            EmotionEngineClient.instance = await EmotionEngineClient.initPromise;
            return EmotionEngineClient.instance;
        } catch {
            EmotionEngineClient.instance = null;
            EmotionEngineClient.initPromise = null;
            return null;
        }
    }

    private static async createEngine(): Promise<EmotionEngine | null> {
        try {
            const storageEngine = getSharedStorageEngine();
            const eventBus = storageEngine.eventBus as IEventBus;
            const repo = storageEngine.getRepository<any>("emotions");
            const repository = {
                findById: (key: string) => repo.getById(key),
                save: (entity: any) => repo.save(entity),
                delete: (key: string) => repo.delete(key),
                exists: (key: string) => repo.exists(key),
                getAll: () => repo.getAll(),
            };
            const engine = new EmotionEngine(eventBus, repository as any);
            await engine.initialize();
            return engine;
        } catch {
            return null;
        }
    }

    static async reset(): Promise<void> {
        if (EmotionEngineClient.instance) {
            try {
                await EmotionEngineClient.instance.shutdown();
            } catch {
                // ignore shutdown errors
            }
            EmotionEngineClient.instance = null;
            EmotionEngineClient.initPromise = null;
        }
    }
}
