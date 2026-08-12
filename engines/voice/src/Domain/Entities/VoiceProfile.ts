export class VoiceProfile {
    private readonly profileId: import("../ValueObjects/VoiceProfileId").VoiceProfileId;
    private readonly characterId: string;
    private readonly voiceId: string;
    private speakingRate: number;
    private pitchModifier: number;
    private readonly supportedParameters: string[];
    private readonly modelMetadata: Record<string, unknown>;
    private readonly providerCapabilityMetadata: Record<string, unknown>;
    private readonly locale: import("../ValueObjects/VoiceLocale").VoiceLocale;
    private configurationVersion: number;
    private readonly createdAt: number;
    private updatedAt: number;

    private constructor(
        profileId: import("../ValueObjects/VoiceProfileId").VoiceProfileId,
        characterId: string,
        voiceId: string,
        speakingRate: number,
        pitchModifier: number,
        supportedParameters: string[],
        modelMetadata: Record<string, unknown>,
        providerCapabilityMetadata: Record<string, unknown>,
        locale: import("../ValueObjects/VoiceLocale").VoiceLocale,
        configurationVersion: number,
        createdAt: number,
        updatedAt: number
    ) {
        this.profileId = profileId;
        this.characterId = characterId;
        this.voiceId = voiceId;
        this.speakingRate = speakingRate;
        this.pitchModifier = pitchModifier;
        this.supportedParameters = supportedParameters;
        this.modelMetadata = modelMetadata;
        this.providerCapabilityMetadata = providerCapabilityMetadata;
        this.locale = locale;
        this.configurationVersion = configurationVersion;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static create(
        profileId: import("../ValueObjects/VoiceProfileId").VoiceProfileId,
        characterId: string,
        voiceId: string,
        locale: import("../ValueObjects/VoiceLocale").VoiceLocale
    ): VoiceProfile {
        return new VoiceProfile(
            profileId,
            characterId,
            voiceId,
            1.0,
            0.0,
            ["speed", "pitch"],
            {},
            {},
            locale,
            1,
            Date.now(),
            Date.now()
        );
    }

    static reconstitute(
        profileId: import("../ValueObjects/VoiceProfileId").VoiceProfileId,
        characterId: string,
        voiceId: string,
        speakingRate: number,
        pitchModifier: number,
        supportedParameters: string[],
        modelMetadata: Record<string, unknown>,
        providerCapabilityMetadata: Record<string, unknown>,
        locale: import("../ValueObjects/VoiceLocale").VoiceLocale,
        configurationVersion: number,
        createdAt: number,
        updatedAt: number
    ): VoiceProfile {
        return new VoiceProfile(profileId, characterId, voiceId, speakingRate, pitchModifier, supportedParameters, modelMetadata, providerCapabilityMetadata, locale, configurationVersion, createdAt, updatedAt);
    }

    getProfileId(): import("../ValueObjects/VoiceProfileId").VoiceProfileId {
        return this.profileId;
    }

    getCharacterId(): string {
        return this.characterId;
    }

    getVoiceId(): string {
        return this.voiceId;
    }

    getSpeakingRate(): number {
        return this.speakingRate;
    }

    getPitchModifier(): number {
        return this.pitchModifier;
    }

    getSupportedParameters(): readonly string[] {
        return this.supportedParameters;
    }

    getModelMetadata(): Record<string, unknown> {
        return this.modelMetadata;
    }

    getProviderCapabilityMetadata(): Record<string, unknown> {
        return this.providerCapabilityMetadata;
    }

    getLocale(): import("../ValueObjects/VoiceLocale").VoiceLocale {
        return this.locale;
    }

    getConfigurationVersion(): number {
        return this.configurationVersion;
    }

    getCreatedAt(): number {
        return this.createdAt;
    }

    getUpdatedAt(): number {
        return this.updatedAt;
    }

    updateSpeakingRate(rate: number): void {
        if (rate < 0.5 || rate > 2.0) {
            throw new Error("Speaking rate must be between 0.5 and 2.0.");
        }
        this.speakingRate = rate;
        this.configurationVersion++;
        this.updatedAt = Date.now();
    }

    updatePitchModifier(modifier: number): void {
        if (modifier < -1.0 || modifier > 1.0) {
            throw new Error("Pitch modifier must be between -1.0 and 1.0.");
        }
        this.pitchModifier = modifier;
        this.configurationVersion++;
        this.updatedAt = Date.now();
    }

    getSnapshot(): object {
        return {
            profileId: this.profileId.getValue(),
            characterId: this.characterId,
            voiceId: this.voiceId,
            speakingRate: this.speakingRate,
            pitchModifier: this.pitchModifier,
            supportedParameters: this.supportedParameters,
            modelMetadata: this.modelMetadata,
            providerCapabilityMetadata: this.providerCapabilityMetadata,
            locale: this.locale.getValue(),
            configurationVersion: this.configurationVersion,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
