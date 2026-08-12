/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: InterruptionType
 */

export class InterruptionType {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static stopGeneration(): InterruptionType { return new InterruptionType("stopGeneration"); }
    public static cancelStream(): InterruptionType { return new InterruptionType("cancelStream"); }
    public static abortToolCall(): InterruptionType { return new InterruptionType("abortToolCall"); }
    public static userInterrupt(): InterruptionType { return new InterruptionType("userInterrupt"); }
    public static systemInterrupt(): InterruptionType { return new InterruptionType("systemInterrupt"); }
    public static timeout(): InterruptionType { return new InterruptionType("timeout"); }
    public static forceCompletion(): InterruptionType { return new InterruptionType("forceCompletion"); }

    public static fromString(value: string): InterruptionType {
        const normalized = value.trim().toLowerCase();
        switch (normalized) {
            case "stopgeneration": return InterruptionType.stopGeneration();
            case "cancelstream": return InterruptionType.cancelStream();
            case "aborttoolcall": return InterruptionType.abortToolCall();
            case "userinterrupt": return InterruptionType.userInterrupt();
            case "systeminterrupt": return InterruptionType.systemInterrupt();
            case "timeout": return InterruptionType.timeout();
            case "forcecompletion": return InterruptionType.forceCompletion();
            default: throw new Error(`Unknown InterruptionType: ${value}`);
        }
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: InterruptionType): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
