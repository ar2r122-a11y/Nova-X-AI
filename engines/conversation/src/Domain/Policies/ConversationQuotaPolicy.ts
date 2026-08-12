export class ConversationQuotaPolicy {
    private readonly maxActiveConversations: number;
    private activeConversations: number = 0;

    public constructor(maxActiveConversations: number = 10) {
        this.maxActiveConversations = maxActiveConversations;
    }

    public canStartNewConversation(): boolean {
        return this.activeConversations < this.maxActiveConversations;
    }

    public incrementActive(): void {
        if (!this.canStartNewConversation()) {
            throw new Error("Conversation quota exceeded.");
        }
        this.activeConversations += 1;
    }

    public decrementActive(): void {
        if (this.activeConversations > 0) {
            this.activeConversations -= 1;
        }
    }

    public getActiveCount(): number {
        return this.activeConversations;
    }

    public getMaxActive(): number {
        return this.maxActiveConversations;
    }
}
