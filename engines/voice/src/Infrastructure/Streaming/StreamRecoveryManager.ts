import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";

export class StreamRecoveryManager {
    private readonly recoveryHistory: Map<string, number> = new Map();

    async recover(streamId: string): Promise<AudioChunk[]> {
        const retryCount = this.recoveryHistory.get(streamId) || 0;
        this.recoveryHistory.set(streamId, retryCount + 1);
        return [];
    }

    canRecover(streamId: string): boolean {
        const retryCount = this.recoveryHistory.get(streamId) || 0;
        return retryCount < 3;
    }

    clear(streamId: string): void {
        this.recoveryHistory.delete(streamId);
    }
}
