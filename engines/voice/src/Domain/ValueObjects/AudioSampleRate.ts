export class AudioSampleRate {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    public static create(value: number): AudioSampleRate {
        const valid = [8000, 16000, 22050, 24000, 44100, 48000];
        if (!valid.includes(value)) {
            throw new Error(`Invalid AudioSampleRate: ${value}. Must be one of ${valid.join(", ")}.`);
        }
        return new AudioSampleRate(value);
    }

    public static hz24000(): AudioSampleRate {
        return AudioSampleRate.create(24000);
    }

    public static hz44100(): AudioSampleRate {
        return AudioSampleRate.create(44100);
    }

    public getValue(): number {
        return this.value;
    }

    public equals(other: AudioSampleRate): boolean {
        return this.value === other.value;
    }
}
