export class VoiceProfileDto {
    constructor(
        public readonly profileId: string,
        public readonly characterId: string,
        public readonly voiceId: string,
        public readonly speakingRate: number,
        public readonly pitchModifier: number,
        public readonly supportedParameters: string[],
        public readonly modelMetadata: Record<string, unknown>,
        public readonly providerCapabilityMetadata: Record<string, unknown>,
        public readonly locale: string,
        public readonly configurationVersion: number,
        public readonly createdAt: number,
        public readonly updatedAt: number
    ) {}

    static fromProfile(profile: {
        getProfileId(): { getValue(): string };
        getCharacterId(): string;
        getVoiceId(): string;
        getSpeakingRate(): number;
        getPitchModifier(): number;
        getSupportedParameters(): readonly string[];
        getModelMetadata(): Record<string, unknown>;
        getProviderCapabilityMetadata(): Record<string, unknown>;
        getLocale(): { getValue(): string };
        getConfigurationVersion(): number;
        getCreatedAt(): number;
        getUpdatedAt(): number;
    }): VoiceProfileDto {
        return new VoiceProfileDto(
            profile.getProfileId().getValue(),
            profile.getCharacterId(),
            profile.getVoiceId(),
            profile.getSpeakingRate(),
            profile.getPitchModifier(),
            Array.from(profile.getSupportedParameters()),
            profile.getModelMetadata(),
            profile.getProviderCapabilityMetadata(),
            profile.getLocale().getValue(),
            profile.getConfigurationVersion(),
            profile.getCreatedAt(),
            profile.getUpdatedAt()
        );
    }
}
