export class AudioChunkSequence {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static initial(): AudioChunkSequence {
        return new AudioChunkSequence(0);
    }

    public static next(sequence: AudioChunkSequence): AudioChunkSequence {
        return new AudioChunkSequence(sequence.value + 1);
    }

    public static create(value: number): AudioChunkSequence {
        if (value < 0) {
            throw new Error("AudioChunkSequence cannot be negative.");
        }
        return new AudioChunkSequence(value);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: AudioChunkSequence): boolean {
        return this.value === other.value;
    }
}
