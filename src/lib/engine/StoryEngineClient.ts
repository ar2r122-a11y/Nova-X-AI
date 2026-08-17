import type { IEventBus } from "@nova-x-ai/core";
import { StoryEngine } from "@nova-x-ai/story";
import { getSharedStorageEngine } from "./SharedInfrastructure";

export class StoryEngineClient {
    private static instance: StoryEngine | null = null;
    private static initPromise: Promise<StoryEngine | null> | null = null;

    static async getEngine(): Promise<StoryEngine | null> {
        if (StoryEngineClient.instance) {
            return StoryEngineClient.instance;
        }
        if (StoryEngineClient.initPromise) {
            return StoryEngineClient.initPromise;
        }

        StoryEngineClient.initPromise = StoryEngineClient.createEngine();
        try {
            StoryEngineClient.instance = await StoryEngineClient.initPromise;
            return StoryEngineClient.instance;
        } catch {
            StoryEngineClient.instance = null;
            StoryEngineClient.initPromise = null;
            return null;
        }
    }

    private static async createEngine(): Promise<StoryEngine | null> {
        try {
            const storageEngine = getSharedStorageEngine();
            const eventBus = storageEngine.eventBus as IEventBus;

            const engine = new StoryEngine(
                eventBus,
                storageEngine
            );
            return engine;
        } catch {
            return null;
        }
    }

    static async reset(): Promise<void> {
        StoryEngineClient.instance = null;
        StoryEngineClient.initPromise = null;
    }
}
