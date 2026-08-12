export class VoiceSessionId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(sessionId: string): VoiceSessionId {
        if (!sessionId || sessionId.trim().length === 0) {
            throw new Error("VoiceSessionId cannot be empty.");
        }
        return new VoiceSessionId(sessionId.trim());
    }

    public static generate(): VoiceSessionId {
        return new VoiceSessionId(`session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: VoiceSessionId): boolean {
        return this.value === other.value;
    }
}
