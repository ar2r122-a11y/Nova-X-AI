import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";

export class JitterBuffer {
    private readonly buffer: Map<number, AudioChunk> = new Map();
    private readonly maxDelayMs: number;
    private lastDeliveryTime = 0;

    constructor(maxDelayMs: number = 50) {
        this.maxDelayMs = maxDelayMs;
    }

    push(chunk: AudioChunk): void {
        const seq = chunk.getSequence().getValue();
        this.buffer.set(seq, chunk);
    }

    pop(): AudioChunk | null {
        if (this.buffer.size === 0) {
            return null;
        }
        const now = Date.now();
        if (now - this.lastDeliveryTime < this.maxDelayMs) {
            return null;
        }
        const firstKey = Math.min(...this.buffer.keys());
        const chunk = this.buffer.get(firstKey)!;
        this.buffer.delete(firstKey);
        this.lastDeliveryTime = now;
        return chunk;
    }

    clear(): void {
        this.buffer.clear();
    }

    size(): number {
        return this.buffer.size;
    }
}
