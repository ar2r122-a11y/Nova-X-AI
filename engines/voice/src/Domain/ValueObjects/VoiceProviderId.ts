export class VoiceProviderId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): VoiceProviderId {
        if (!value || value.trim().length === 0) {
            throw new Error("VoiceProviderId cannot be empty.");
        }
        return new VoiceProviderId(value.trim());
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: VoiceProviderId): boolean {
        return this.value === other.value;
    }
}
