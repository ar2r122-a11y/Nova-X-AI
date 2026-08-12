export class VoiceProfileId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(profileId: string): VoiceProfileId {
        if (!profileId || profileId.trim().length === 0) {
            throw new Error("VoiceProfileId cannot be empty.");
        }
        return new VoiceProfileId(profileId.trim());
    }

    public static generate(): VoiceProfileId {
        return new VoiceProfileId(`profile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: VoiceProfileId): boolean {
        return this.value === other.value;
    }
}
