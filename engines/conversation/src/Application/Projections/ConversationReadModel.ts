import { ConversationSessionDto } from "../DTO/ConversationSessionDto";

export interface ConversationReadModel {
    getConversation(conversationId: string): Promise<ConversationSessionDto | null>;
    getConversationsByOwner(ownerId: string): Promise<ConversationSessionDto[]>;
    getAllConversations(): Promise<ConversationSessionDto[]>;
}
