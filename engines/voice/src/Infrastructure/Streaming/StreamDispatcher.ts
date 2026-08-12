import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";

export class StreamDispatcher {
    private readonly listeners: Map<string, (chunk: AudioChunk) => void> = new Map();

    registerListener(streamId: string, listener: (chunk: AudioChunk) => void): void {
        this.listeners.set(streamId, listener);
    }

    unregisterListener(streamId: string): void {
        this.listeners.delete(streamId);
    }

    dispatch(chunk: AudioChunk): void {
        const streamId = chunk.getSequence().getValue().toString();
        const listener = this.listeners.get(streamId);
        if (listener) {
            listener(chunk);
        }
    }

    clear(): void {
        this.listeners.clear();
    }
}
