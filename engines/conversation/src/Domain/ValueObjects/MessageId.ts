/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: MessageId
 */

export class MessageId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): MessageId {
        if (!value || value.trim().length === 0) {
            throw new Error("MessageId cannot be empty.");
        }
        return new MessageId(value.trim());
    }

    public static generate(): MessageId {
        return new MessageId(`msg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: MessageId): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
