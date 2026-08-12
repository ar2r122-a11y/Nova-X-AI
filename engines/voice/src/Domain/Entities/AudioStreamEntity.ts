export class AudioStreamEntity {
    private readonly streamId: string;
    private readonly voiceId: string;
    private readonly requestId: string;
    private readonly profileId: string;
    private readonly providerId: string;
    private readonly text: string;
    private readonly createdAt: number;
    private completedAt: number | null;
    private readonly chunks: import("../ValueObjects/AudioChunk").AudioChunk[];
    private totalBytes: number;
    private status: string;

    private constructor(
        streamId: string,
        voiceId: string,
        requestId: string,
        profileId: string,
        providerId: string,
        text: string,
        createdAt: number,
        chunks: import("../ValueObjects/AudioChunk").AudioChunk[],
        totalBytes: number,
        status: string
    ) {
        this.streamId = streamId;
        this.voiceId = voiceId;
        this.requestId = requestId;
        this.profileId = profileId;
        this.providerId = providerId;
        this.text = text;
        this.createdAt = createdAt;
        this.completedAt = null;
        this.chunks = chunks;
        this.totalBytes = totalBytes;
        this.status = status;
    }

    static create(streamId: string, voiceId: string, requestId: string, profileId: string, providerId: string, text: string): AudioStreamEntity {
        return new AudioStreamEntity(streamId, voiceId, requestId, profileId, providerId, text, Date.now(), [], 0, "active");
    }

    static reconstitute(
        streamId: string,
        voiceId: string,
        requestId: string,
        profileId: string,
        providerId: string,
        text: string,
        createdAt: number,
        completedAt: number | null,
        chunks: import("../ValueObjects/AudioChunk").AudioChunk[],
        totalBytes: number,
        status: string
    ): AudioStreamEntity {
        const entity = new AudioStreamEntity(streamId, voiceId, requestId, profileId, providerId, text, createdAt, chunks, totalBytes, status);
        entity.completedAt = completedAt;
        return entity;
    }

    getStreamId(): string {
        return this.streamId;
    }

    getVoiceId(): string {
        return this.voiceId;
    }

    getRequestId(): string {
        return this.requestId;
    }

    getProfileId(): string {
        return this.profileId;
    }

    getProviderId(): string {
        return this.providerId;
    }

    getText(): string {
        return this.text;
    }

    getCreatedAt(): number {
        return this.createdAt;
    }

    getCompletedAt(): number | null {
        return this.completedAt;
    }

    getChunks(): readonly import("../ValueObjects/AudioChunk").AudioChunk[] {
        return this.chunks;
    }

    getTotalBytes(): number {
        return this.totalBytes;
    }

    getStatus(): string {
        return this.status;
    }

    appendChunk(chunk: import("../ValueObjects/AudioChunk").AudioChunk): void {
        this.chunks.push(chunk);
        this.totalBytes += chunk.getByteLength();
    }

    complete(): void {
        this.completedAt = Date.now();
        this.status = "completed";
    }

    cancel(): void {
        this.status = "cancelled";
    }

    fail(reason: string): void {
        this.status = `failed: ${reason}`;
    }

    getSnapshot(): object {
        return {
            streamId: this.streamId,
            voiceId: this.voiceId,
            requestId: this.requestId,
            profileId: this.profileId,
            providerId: this.providerId,
            text: this.text,
            createdAt: this.createdAt,
            completedAt: this.completedAt,
            totalChunks: this.chunks.length,
            totalBytes: this.totalBytes,
            status: this.status
        };
    }
}
