/**
 * Nova X AI
 * Conversation Engine
 * Domain Exception: ConversationException
 */

export class ConversationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConversationException";
    }
}
