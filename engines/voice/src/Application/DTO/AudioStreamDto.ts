export class AudioStreamDto {
    constructor(
        public readonly streamId: string,
        public readonly voiceId: string,
        public readonly requestId: string,
        public readonly profileId: string,
        public readonly providerId: string,
        public readonly text: string,
        public readonly status: string,
        public readonly totalChunks: number,
        public readonly totalBytes: number,
        public readonly createdAt: number,
        public readonly completedAt: number | null
    ) {}

    static fromAggregate(aggregate: {
        getStreamId(): string;
        getVoiceId(): string;
        getRequestId(): string;
        getProfileId(): string;
        getProviderId(): string;
        getText(): string;
        getStatus(): string;
        getChunks(): readonly { getByteLength(): number }[];
        getTotalBytes(): number;
        getCreatedAt(): number;
        getCompletedAt(): number | null;
    }): AudioStreamDto {
        return new AudioStreamDto(
            aggregate.getStreamId(),
            aggregate.getVoiceId(),
            aggregate.getRequestId(),
            aggregate.getProfileId(),
            aggregate.getProviderId(),
            aggregate.getText(),
            aggregate.getStatus(),
            aggregate.getChunks().length,
            aggregate.getTotalBytes(),
            aggregate.getCreatedAt(),
            aggregate.getCompletedAt()
        );
    }
}
