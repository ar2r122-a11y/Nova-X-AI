export class VoiceId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(voiceId: string): VoiceId {
        if (!voiceId || voiceId.trim().length === 0) {
            throw new Error("VoiceId cannot be empty.");
        }
        return new VoiceId(voiceId.trim());
    }

    public static generate(): VoiceId {
        return new VoiceId(`voice-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: VoiceId): boolean {
        return this.value === other.value;
    }
}
