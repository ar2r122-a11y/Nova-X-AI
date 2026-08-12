/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: StreamState
 */

export class StreamState {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static inactive(): StreamState { return new StreamState("inactive"); }
    public static active(): StreamState { return new StreamState("active"); }
    public static paused(): StreamState { return new StreamState("paused"); }
    public static completed(): StreamState { return new StreamState("completed"); }
    public static failed(): StreamState { return new StreamState("failed"); }
    public static cancelled(): StreamState { return new StreamState("cancelled"); }
    public static recovering(): StreamState { return new StreamState("recovering"); }

    public static fromString(value: string): StreamState {
        const normalized = value.trim().toLowerCase();
        switch (normalized) {
            case "inactive": return StreamState.inactive();
            case "active": return StreamState.active();
            case "paused": return StreamState.paused();
            case "completed": return StreamState.completed();
            case "failed": return StreamState.failed();
            case "cancelled": return StreamState.cancelled();
            case "recovering": return StreamState.recovering();
            default: throw new Error(`Unknown StreamState: ${value}`);
        }
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: StreamState): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
