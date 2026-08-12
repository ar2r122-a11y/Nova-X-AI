import { Message } from "../Entities/Message";

export interface IMessageRepository {
    save(message: Message): Promise<void>;
    getById(messageId: string): Promise<Message | null>;
    getByConversationId(conversationId: string): Promise<Message[]>;
    delete(messageId: string): Promise<void>;
    exists(messageId: string): Promise<boolean>;
}
