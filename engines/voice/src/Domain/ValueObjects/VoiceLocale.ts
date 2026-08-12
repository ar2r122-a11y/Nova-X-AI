export class VoiceLocale {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): VoiceLocale {
        if (!value || value.trim().length === 0) {
            throw new Error("VoiceLocale cannot be empty.");
        }
        if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(value)) {
            throw new Error(`Invalid VoiceLocale format: ${value}. Expected format like 'en' or 'en-US'.`);
        }
        return new VoiceLocale(value.trim());
    }

    public static english(): VoiceLocale {
        return VoiceLocale.create("en");
    }

    public static englishUS(): VoiceLocale {
        return VoiceLocale.create("en-US");
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: VoiceLocale): boolean {
        return this.value === other.value;
    }
}
