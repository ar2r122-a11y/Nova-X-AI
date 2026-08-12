export class AudioBitDepth {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): AudioBitDepth {
        const valid = [16, 24, 32];
        if (!valid.includes(value)) {
            throw new Error(`Invalid AudioBitDepth: ${value}. Must be one of ${valid.join(", ")}.`);
        }
        return new AudioBitDepth(value);
    }

    public static bit16(): AudioBitDepth {
        return AudioBitDepth.create(16);
    }

    public static bit24(): AudioBitDepth {
        return AudioBitDepth.create(24);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: AudioBitDepth): boolean {
        return this.value === other.value;
    }
}
