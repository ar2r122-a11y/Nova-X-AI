import { ConversationAggregate } from "../Aggregates/ConversationAggregate";

export interface IConversationRepository {
    save(conversation: ConversationAggregate): Promise<void>;
    getById(conversationId: string): Promise<ConversationAggregate | null>;
    getAll(): Promise<ConversationAggregate[]>;
    delete(conversationId: string): Promise<void>;
    exists(conversationId: string): Promise<boolean>;
}
