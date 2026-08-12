/**
 * Nova X AI
 * Conversation Engine
 * Domain Value Object: StreamChunkSequence
 */

export class StreamChunkSequence {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): StreamChunkSequence {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("StreamChunkSequence must be a non-negative integer.");
        }
        return new StreamChunkSequence(value);
    }

    public static initial(): StreamChunkSequence {
        return new StreamChunkSequence(0);
    }

    public getValue(): number {
        return this.value;
    }

    public next(): StreamChunkSequence {
        return new StreamChunkSequence(this.value + 1);
    }

    public equals(other: StreamChunkSequence): boolean {
        return this.value === other.value;
    }
}
