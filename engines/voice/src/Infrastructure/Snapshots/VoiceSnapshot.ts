export class VoiceSnapshot {
    private readonly voiceId: string;
    private readonly voiceState: string;
    private readonly providerId: string;
    private readonly version: number;
    private readonly timestamp: number;

    constructor(voiceId: string, voiceState: string, providerId: string, version: number, timestamp: number) {
        this.voiceId = voiceId;
        this.voiceState = voiceState;
        this.providerId = providerId;
        this.version = version;
        this.timestamp = timestamp;
    }

    getVoiceId(): string {
        return this.voiceId;
    }

    getVoiceState(): string {
        return this.voiceState;
    }

    getProviderId(): string {
        return this.providerId;
    }

    getVersion(): number {
        return this.version;
    }

    getTimestamp(): number {
        return this.timestamp;
    }

    toJSON(): object {
        return {
            voiceId: this.voiceId,
            voiceState: this.voiceState,
            providerId: this.providerId,
            version: this.version,
            timestamp: this.timestamp
        };
    }
}

export class VoiceSnapshotManager {
    async takeSnapshot(voiceId: string, aggregate: { getSnapshot(): object }): Promise<VoiceSnapshot> {
        const snapshot = aggregate.getSnapshot();
        return new VoiceSnapshot(
            voiceId,
            (snapshot as any).voiceState,
            (snapshot as any).providerId,
            (snapshot as any).version,
            Date.now()
        );
    }
}
