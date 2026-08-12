export class ScheduledVoiceTaskDto {
    constructor(
        public readonly taskId: string,
        public readonly voiceId: string,
        public readonly text: string,
        public readonly profileId: string,
        public readonly scheduledAt: number,
        public readonly priority: number,
        public readonly status: string,
        public readonly retryCount: number,
        public readonly maxRetries: number
    ) {}

    static fromEntity(entity: {
        getTaskId(): string;
        getVoiceId(): string;
        getText(): string;
        getProfileId(): string;
        getScheduledAt(): number;
        getPriority(): number;
        getStatus(): string;
        getRetryCount(): number;
        getMaxRetries(): number;
    }): ScheduledVoiceTaskDto {
        return new ScheduledVoiceTaskDto(
            entity.getTaskId(),
            entity.getVoiceId(),
            entity.getText(),
            entity.getProfileId(),
            entity.getScheduledAt(),
            entity.getPriority(),
            entity.getStatus(),
            entity.getRetryCount(),
            entity.getMaxRetries()
        );
    }
}
