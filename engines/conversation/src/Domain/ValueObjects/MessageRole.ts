/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: MessageRole
 */

export class MessageRole {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static system(): MessageRole { return new MessageRole("system"); }
    public static user(): MessageRole { return new MessageRole("user"); }
    public static assistant(): MessageRole { return new MessageRole("assistant"); }
    public static tool(): MessageRole { return new MessageRole("tool"); }

    public static fromString(value: string): MessageRole {
        const normalized = value.trim().toLowerCase();
        switch (normalized) {
            case "system": return MessageRole.system();
            case "user": return MessageRole.user();
            case "assistant": return MessageRole.assistant();
            case "tool": return MessageRole.tool();
            default: throw new Error(`Unknown MessageRole: ${value}`);
        }
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: MessageRole): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
