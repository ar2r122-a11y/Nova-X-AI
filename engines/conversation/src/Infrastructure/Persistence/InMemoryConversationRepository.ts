import { IConversationRepository } from "../../Domain/Repositories/IConversationRepository";
import { ConversationAggregate } from "../../Domain/Aggregates/ConversationAggregate";

export class InMemoryConversationRepository implements IConversationRepository {
    private readonly store = new Map<string, ConversationAggregate>();

    async save(conversation: ConversationAggregate): Promise<void> {
        this.store.set(conversation.getId().getValue(), conversation);
    }

    async getById(conversationId: string): Promise<ConversationAggregate | null> {
        return this.store.get(conversationId) || null;
    }

    async getAll(): Promise<ConversationAggregate[]> {
        return Array.from(this.store.values());
    }

    async delete(conversationId: string): Promise<void> {
        this.store.delete(conversationId);
    }

    async exists(conversationId: string): Promise<boolean> {
        return this.store.has(conversationId);
    }
}
