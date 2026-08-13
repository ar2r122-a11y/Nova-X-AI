import type { IEventBus } from "@nova-x-ai/core";
import { ConversationEngine } from "@nova-x-ai/conversation";

class SimpleEventBus implements IEventBus {
    private handlers: Map<string, Set<any>> = new Map();

    async publish(event: any): Promise<void> {
        const handlers = this.handlers.get((event as any).eventType);
        if (handlers) {
            for (const handler of handlers) {
                await handler.handle(event);
            }
        }
    }

    subscribe(eventType: string, handler: any): void {
        const handlers = this.handlers.get(eventType);
        if (handlers) {
            handlers.add(handler);
        } else {
            this.handlers.set(eventType, new Set([handler]));
        }
    }
}

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
        const eventBus = new SimpleEventBus();
        return new ConversationEngine(eventBus);
    }

    static async reset(): Promise<void> {
        ConversationEngineClient.instance = null;
        ConversationEngineClient.initPromise = null;
    }
}
