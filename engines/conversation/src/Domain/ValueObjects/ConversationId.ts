/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: ConversationId
 */

export class ConversationId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): ConversationId {
        if (!value || value.trim().length === 0) {
            throw new Error("ConversationId cannot be empty.");
        }
        return new ConversationId(value.trim());
    }

    public static generate(): ConversationId {
        return new ConversationId(`conv-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ConversationId): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
