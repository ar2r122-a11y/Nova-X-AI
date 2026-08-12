/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: ConversationState
 */

export class ConversationState {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static idle(): ConversationState { return new ConversationState("idle"); }
    public static waitingForAI(): ConversationState { return new ConversationState("waitingForAI"); }
    public static toolExecution(): ConversationState { return new ConversationState("toolExecution"); }
    public static streaming(): ConversationState { return new ConversationState("streaming"); }
    public static interrupted(): ConversationState { return new ConversationState("interrupted"); }
    public static ended(): ConversationState { return new ConversationState("ended"); }
    public static error(): ConversationState { return new ConversationState("error"); }

    public static fromString(value: string): ConversationState {
        const normalized = value.trim().toLowerCase();
        switch (normalized) {
            case "idle": return ConversationState.idle();
            case "waitingforai": return ConversationState.waitingForAI();
            case "toolexecution": return ConversationState.toolExecution();
            case "streaming": return ConversationState.streaming();
            case "interrupted": return ConversationState.interrupted();
            case "ended": return ConversationState.ended();
            case "error": return ConversationState.error();
            default: throw new Error(`Unknown ConversationState: ${value}`);
        }
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ConversationState): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
