
export class VoiceTone {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(tone: string): VoiceTone {
        if (!tone || tone.trim().length === 0) {
            throw new Error("VoiceTone cannot be empty.");
        }
        return new VoiceTone(tone);
    }

    public static fromString(value: string): VoiceTone {
        return VoiceTone.create(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: VoiceTone): boolean {
        return this.value === other.value;
    }
}
