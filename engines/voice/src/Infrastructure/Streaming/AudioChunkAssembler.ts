import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../Domain/ValueObjects/AudioCodec";

export class AudioChunkAssembler {
    private readonly chunks: Map<number, AudioChunk> = new Map();
    private nextSequence = 0;

    assemble(chunk: AudioChunk): AudioChunk | null {
        const sequence = chunk.getSequence().getValue();
        if (sequence < this.nextSequence) {
            return null;
        }
        this.chunks.set(sequence, chunk);
        while (this.chunks.has(this.nextSequence)) {
            const assembled = this.chunks.get(this.nextSequence)!;
            this.chunks.delete(this.nextSequence);
            this.nextSequence++;
            if (assembled.getIsLast()) {
                this.nextSequence = 0;
                this.chunks.clear();
                return assembled;
            }
        }
        return null;
    }

    reset(): void {
        this.chunks.clear();
        this.nextSequence = 0;
    }
}
