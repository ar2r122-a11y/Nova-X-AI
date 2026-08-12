/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: CompressionStrategy
 */

export class CompressionStrategy {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static none(): CompressionStrategy { return new CompressionStrategy("none"); }
    public static slidingWindow(): CompressionStrategy { return new CompressionStrategy("slidingWindow"); }
    public static rollingSummary(): CompressionStrategy { return new CompressionStrategy("rollingSummary"); }
    public static semantic(): CompressionStrategy { return new CompressionStrategy("semantic"); }

    public static fromString(value: string): CompressionStrategy {
        const normalized = value.trim().toLowerCase();
        switch (normalized) {
            case "none": return CompressionStrategy.none();
            case "slidingwindow": return CompressionStrategy.slidingWindow();
            case "rollingsummary": return CompressionStrategy.rollingSummary();
            case "semantic": return CompressionStrategy.semantic();
            default: throw new Error(`Unknown CompressionStrategy: ${value}`);
        }
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: CompressionStrategy): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value;
    }
}
