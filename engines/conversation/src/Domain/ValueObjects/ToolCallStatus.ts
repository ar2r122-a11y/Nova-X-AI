/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: ToolCallStatus
 */

export class ToolCallStatus {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static pending(): ToolCallStatus { return new ToolCallStatus("pending"); }
    public static executing(): ToolCallStatus { return new ToolCallStatus("executing"); }
    public static completed(): ToolCallStatus { return new ToolCallStatus("completed"); }
    public static failed(): ToolCallStatus { return new ToolCallStatus("failed"); }
    public static timeout(): ToolCallStatus { return new ToolCallStatus("timeout"); }
    public static aborted(): ToolCallStatus { return new ToolCallStatus("aborted"); }

    public static fromString(value: string): ToolCallStatus {
        const normalized = value.trim().toLowerCase();
        switch (normalized) {
            case "pending": return ToolCallStatus.pending();
            case "executing": return ToolCallStatus.executing();
            case "completed": return ToolCallStatus.completed();
            case "failed": return ToolCallStatus.failed();
            case "timeout": return ToolCallStatus.timeout();
            case "aborted": return ToolCallStatus.aborted();
            default: throw new Error(`Unknown ToolCallStatus: ${value}`);
        }
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ToolCallStatus): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
