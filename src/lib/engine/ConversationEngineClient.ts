import type { IEventBus } from "@nova-x-ai/core";
import { ConversationEngine } from "@nova-x-ai/conversation";
import { AIRouter, FakeAiProvider, OpenRouterAiProvider } from "@nova-x-ai/ai-router";
import { getSharedStorageEngine } from "./SharedInfrastructure";
import { ConversationContextProvider } from "./ConversationContextProvider";

export class ConversationEngineClient {
    private static instance: ConversationEngine | null = null;
    private static initPromise: Promise<ConversationEngine> | null = null;

    static async getEngine(): Promise<ConversationEngine> {
        if (ConversationEngineClient.instance) {
            return ConversationEngineClient.instance;
        }
        if (ConversationEngineClient.initPromise) {
            return ConversationEngineClient.initPromise;
        }

        ConversationEngineClient.initPromise = ConversationEngineClient.createEngine();
        ConversationEngineClient.instance = await ConversationEngineClient.initPromise;
        return ConversationEngineClient.instance;
    }

    private static async createEngine(): Promise<ConversationEngine> {
        const storageEngine = getSharedStorageEngine();
        const eventBus = storageEngine.eventBus as IEventBus;
        const aiRouter = new AIRouter();
        const openRouterProvider = new OpenRouterAiProvider({
            serverEndpoint: "/api/ai/chat"
        });
        aiRouter.registerProvider(openRouterProvider, 0, true);
        const fakeProvider = new FakeAiProvider();
        aiRouter.registerProvider(fakeProvider, 1, true);
        const contextProvider = new ConversationContextProvider();
        return new ConversationEngine(eventBus, aiRouter, contextProvider);
    }

    static async reset(): Promise<void> {
        ConversationEngineClient.instance = null;
        ConversationEngineClient.initPromise = null;
    }
}
