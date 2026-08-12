export class VoiceSessionDto {
    constructor(
        public readonly sessionId: string,
        public readonly voiceId: string,
        public readonly profileId: string,
        public readonly state: string,
        public readonly startedAt: number,
        public readonly endedAt: number | null,
        public readonly totalAudioDurationMs: number,
        public readonly text: string
    ) {}

    static fromAggregate(aggregate: {
        getSessionId(): { getValue(): string };
        getVoiceId(): { getValue(): string };
        getProfileId(): { getValue(): string };
        getSessionState(): { getValue(): string };
        getStartedAt(): number;
        getEndedAt(): number | null;
        getTotalAudioDurationMs(): number;
        getText(): string;
    }): VoiceSessionDto {
        return new VoiceSessionDto(
            aggregate.getSessionId().getValue(),
            aggregate.getVoiceId().getValue(),
            aggregate.getProfileId().getValue(),
            aggregate.getSessionState().getValue(),
            aggregate.getStartedAt(),
            aggregate.getEndedAt(),
            aggregate.getTotalAudioDurationMs(),
            aggregate.getText()
        );
    }
}
