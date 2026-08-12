export class ScheduledVoiceTaskEntity {
    private readonly taskId: string;
    private readonly voiceId: string;
    private readonly text: string;
    private readonly profileId: string;
    private readonly scheduledAt: number;
    private readonly priority: number;
    private readonly maxRetries: number;
    private retryCount: number;
    private status: string;
    private lastError: string | null;
    private readonly createdAt: number;
    private updatedAt: number;

    private constructor(
        taskId: string,
        voiceId: string,
        text: string,
        profileId: string,
        scheduledAt: number,
        priority: number,
        maxRetries: number,
        retryCount: number,
        status: string,
        lastError: string | null,
        createdAt: number,
        updatedAt: number
    ) {
        this.taskId = taskId;
        this.voiceId = voiceId;
        this.text = text;
        this.profileId = profileId;
        this.scheduledAt = scheduledAt;
        this.priority = priority;
        this.maxRetries = maxRetries;
        this.retryCount = retryCount;
        this.status = status;
        this.lastError = lastError;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static create(taskId: string, voiceId: string, text: string, profileId: string, scheduledAt: number, priority: number, maxRetries: number): ScheduledVoiceTaskEntity {
        return new ScheduledVoiceTaskEntity(taskId, voiceId, text, profileId, scheduledAt, priority, maxRetries, 0, "pending", null, Date.now(), Date.now());
    }

    static reconstitute(
        taskId: string,
        voiceId: string,
        text: string,
        profileId: string,
        scheduledAt: number,
        priority: number,
        maxRetries: number,
        retryCount: number,
        status: string,
        lastError: string | null,
        createdAt: number,
        updatedAt: number
    ): ScheduledVoiceTaskEntity {
        return new ScheduledVoiceTaskEntity(taskId, voiceId, text, profileId, scheduledAt, priority, maxRetries, retryCount, status, lastError, createdAt, updatedAt);
    }

    getTaskId(): string {
        return this.taskId;
    }

    getVoiceId(): string {
        return this.voiceId;
    }

    getText(): string {
        return this.text;
    }

    getProfileId(): string {
        return this.profileId;
    }

    getScheduledAt(): number {
        return this.scheduledAt;
    }

    getPriority(): number {
        return this.priority;
    }

    getMaxRetries(): number {
        return this.maxRetries;
    }

    getRetryCount(): number {
        return this.retryCount;
    }

    getStatus(): string {
        return this.status;
    }

    getLastError(): string | null {
        return this.lastError;
    }

    getCreatedAt(): number {
        return this.createdAt;
    }

    getUpdatedAt(): number {
        return this.updatedAt;
    }

    incrementRetry(): void {
        this.retryCount++;
        this.updatedAt = Date.now();
    }

    markRunning(): void {
        this.status = "running";
        this.updatedAt = Date.now();
    }

    markCompleted(): void {
        this.status = "completed";
        this.updatedAt = Date.now();
    }

    markFailed(error: string): void {
        this.status = "failed";
        this.lastError = error;
        this.updatedAt = Date.now();
    }

    canRetry(): boolean {
        return this.retryCount < this.maxRetries;
    }

    getSnapshot(): object {
        return {
            taskId: this.taskId,
            voiceId: this.voiceId,
            text: this.text,
            profileId: this.profileId,
            scheduledAt: this.scheduledAt,
            priority: this.priority,
            maxRetries: this.maxRetries,
            retryCount: this.retryCount,
            status: this.status,
            lastError: this.lastError,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
