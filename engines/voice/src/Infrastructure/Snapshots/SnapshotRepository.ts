import type { ISnapshotStore } from "@nova-x-ai/storage";
import { VoiceSnapshot } from "./VoiceSnapshot";

export class SnapshotRepository {
    constructor(private readonly snapshotStore: ISnapshotStore) {}

    async save(snapshot: VoiceSnapshot): Promise<void> {
        await this.snapshotStore.saveSnapshot({
            streamId: snapshot.getVoiceId(),
            version: snapshot.getVersion(),
            data: snapshot.toJSON(),
            timestamp: snapshot.getTimestamp()
        } as any);
    }

    async get(voiceId: string): Promise<VoiceSnapshot | null> {
        const stored = await this.snapshotStore.getSnapshot(voiceId);
        if (!stored) {
            return null;
        }
        const data = stored.data as any;
        return new VoiceSnapshot(
            data.voiceId,
            data.voiceState,
            data.providerId,
            data.version,
            data.timestamp
        );
    }

    async delete(voiceId: string): Promise<void> {
        await this.snapshotStore.deleteSnapshot(voiceId);
    }
}
