import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { PCMBuffer } from "../../Domain/ValueObjects/PCMBuffer";
import { AudioCodec } from "../../Domain/ValueObjects/AudioCodec";

export class StreamManager {
    private readonly streams: Map<string, { chunks: AudioChunk[]; status: string }> = new Map();

    registerStream(streamId: string): void {
        this.streams.set(streamId, { chunks: [], status: "active" });
    }

    appendChunk(streamId: string, chunk: AudioChunk): void {
        const stream = this.streams.get(streamId);
        if (stream) {
            stream.chunks.push(chunk);
        }
    }

    completeStream(streamId: string): void {
        const stream = this.streams.get(streamId);
        if (stream) {
            stream.status = "completed";
        }
    }

    cancelStream(streamId: string): void {
        const stream = this.streams.get(streamId);
        if (stream) {
            stream.status = "cancelled";
        }
    }

    getStream(streamId: string): { chunks: AudioChunk[]; status: string } | undefined {
        return this.streams.get(streamId);
    }

    removeStream(streamId: string): void {
        this.streams.delete(streamId);
    }
}
