export class AudioCodec {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): AudioCodec {
        const valid = ["pcm", "opus", "aac"];
        if (!valid.includes(value.toLowerCase())) {
            throw new Error(`Invalid AudioCodec: ${value}. Must be one of ${valid.join(", ")}.`);
        }
        return new AudioCodec(value.toLowerCase());
    }

    public static pcm(): AudioCodec {
        return AudioCodec.create("pcm");
    }

    public static opus(): AudioCodec {
        return AudioCodec.create("opus");
    }

    public static aac(): AudioCodec {
        return AudioCodec.create("aac");
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: AudioCodec): boolean {
        return this.value === other.value;
    }
}
