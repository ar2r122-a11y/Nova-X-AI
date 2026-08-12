import { VoiceSnapshot } from "./VoiceSnapshot";

export class SnapshotFactory {
    static createVoiceSnapshot(voiceId: string, aggregate: { getSnapshot(): object }): VoiceSnapshot {
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
