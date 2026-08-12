export class AudioStreamHandleDto {
    constructor(
        public readonly streamId: string,
        public readonly requestId: string,
        public readonly voiceId: string,
        public readonly providerId: string,
        public readonly profileId: string,
        public readonly status: string,
        public readonly estimatedDurationMs: number,
        public readonly correlationId: string
    ) {}

    static fromResult(result: {
        streamId: string;
        requestId: string;
        voiceId: string;
        providerId: string;
        profileId: string;
        status: string;
        estimatedDurationMs: number;
        correlationId: string;
    }): AudioStreamHandleDto {
        return new AudioStreamHandleDto(
            result.streamId,
            result.requestId,
            result.voiceId,
            result.providerId,
            result.profileId,
            result.status,
            result.estimatedDurationMs,
            result.correlationId
        );
    }
}
