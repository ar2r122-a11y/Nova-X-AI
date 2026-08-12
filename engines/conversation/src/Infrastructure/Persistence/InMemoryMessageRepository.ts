import { IMessageRepository } from "../../Domain/Repositories/IMessageRepository";
import { Message } from "../../Domain/Entities/Message";

export class InMemoryMessageRepository implements IMessageRepository {
    private readonly store = new Map<string, Message>();
    private readonly byConversation = new Map<string, Message[]>();

    async save(message: Message): Promise<void> {
        this.store.set(message.getId().getValue(), message);
    }

    async getById(messageId: string): Promise<Message | null> {
        return this.store.get(messageId) || null;
    }

    async getByConversationId(conversationId: string): Promise<Message[]> {
        return this.byConversation.get(conversationId) || [];
    }

    async delete(messageId: string): Promise<void> {
        this.store.delete(messageId);
    }

    async exists(messageId: string): Promise<boolean> {
        return this.store.has(messageId);
    }
}
