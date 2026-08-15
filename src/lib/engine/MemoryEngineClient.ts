import type { IEventBus } from "@nova-x-ai/core";
import { MemoryEngine } from "@nova-x-ai/memory";
import { getSharedStorageEngine } from "./SharedInfrastructure";

export class MemoryEngineClient {
    private static instance: MemoryEngine | null = null;
    private static initPromise: Promise<MemoryEngine | null> | null = null;

    static async getEngine(): Promise<MemoryEngine | null> {
        if (MemoryEngineClient.instance) {
            return MemoryEngineClient.instance;
        }
        if (MemoryEngineClient.initPromise) {
            return MemoryEngineClient.initPromise;
        }

        MemoryEngineClient.initPromise = MemoryEngineClient.createEngine();
        try {
            MemoryEngineClient.instance = await MemoryEngineClient.initPromise;
            return MemoryEngineClient.instance;
        } catch {
            MemoryEngineClient.instance = null;
            MemoryEngineClient.initPromise = null;
            return null;
        }
    }

    private static async createEngine(): Promise<MemoryEngine | null> {
        try {
            const storageEngine = getSharedStorageEngine();
            const eventBus = storageEngine.eventBus as IEventBus;
            const repo = storageEngine.getRepository<any>("memories");
            const repository = {
                findById: (key: string) => repo.getById(key),
                save: (entity: any) => repo.save(entity),
                delete: (key: string) => repo.delete(key),
                exists: (key: string) => repo.exists(key),
                getAll: () => repo.getAll(),
            };
            const engine = new MemoryEngine(eventBus, repository as any);
            await engine.initialize();
            return engine;
        } catch {
            return null;
        }
    }

    static async reset(): Promise<void> {
        if (MemoryEngineClient.instance) {
            try {
                await MemoryEngineClient.instance.shutdown();
            } catch {
                // ignore shutdown errors
            }
            MemoryEngineClient.instance = null;
            MemoryEngineClient.initPromise = null;
        }
    }
}
