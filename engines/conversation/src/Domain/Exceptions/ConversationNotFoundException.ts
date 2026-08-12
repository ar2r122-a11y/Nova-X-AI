import { ConversationException } from "./ConversationException";

export class ConversationNotFoundException extends ConversationException {
    constructor(conversationId: string) {
        super(`Conversation ${conversationId} not found.`);
        this.name = "ConversationNotFoundException";
    }
}
