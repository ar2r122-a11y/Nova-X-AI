export class ConversationRetentionPolicy {
    private readonly maxAgeMs: number;
    private readonly maxMessagesPerConversation: number;

    public constructor(maxAgeMs: number = 86_400_000, maxMessagesPerConversation: number = 1000) {
        this.maxAgeMs = maxAgeMs;
        this.maxMessagesPerConversation = maxMessagesPerConversation;
    }

    public isExpired(createdAt: number): boolean {
        return Date.now() - createdAt > this.maxAgeMs;
    }

    public canRetain(messageCount: number): boolean {
        return messageCount < this.maxMessagesPerConversation;
    }

    public getMaxAgeMs(): number {
        return this.maxAgeMs;
    }

    public getMaxMessages(): number {
        return this.maxMessagesPerConversation;
    }
}
