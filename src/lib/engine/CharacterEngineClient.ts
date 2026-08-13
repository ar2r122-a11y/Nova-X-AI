import type { IEventBus } from "@nova-x-ai/core";
import { CharacterEngine, CharacterRepositoryImpl, CharacterContextBuilder } from "@nova-x-ai/character";
import { createBrowserStorageEngine } from "./BrowserStorageEngine";

export class CharacterEngineClient {
    private static instance: CharacterEngine | null = null;
    private static initPromise: Promise<CharacterEngine> | null = null;

    static async getEngine(): Promise<CharacterEngine> {
        if (CharacterEngineClient.instance) {
            return CharacterEngineClient.instance;
        }
        if (CharacterEngineClient.initPromise) {
            return CharacterEngineClient.initPromise;
        }

        CharacterEngineClient.initPromise = CharacterEngineClient.createEngine();
        CharacterEngineClient.instance = await CharacterEngineClient.initPromise;
        return CharacterEngineClient.instance;
    }

    private static async createEngine(): Promise<CharacterEngine> {
        const storageEngine = createBrowserStorageEngine();
        const eventBus = storageEngine.eventBus as IEventBus;

        const repository = new CharacterRepositoryImpl(storageEngine);
        const contextBuilder = new CharacterContextBuilder();

        const engine = new CharacterEngine(eventBus, repository, contextBuilder);
        await engine.initialize();
        return engine;
    }

    static async reset(): Promise<void> {
        if (CharacterEngineClient.instance) {
            await CharacterEngineClient.instance.shutdown();
            CharacterEngineClient.instance = null;
            CharacterEngineClient.initPromise = null;
        }
        localStorage.removeItem("nova-storage");
    }
}
