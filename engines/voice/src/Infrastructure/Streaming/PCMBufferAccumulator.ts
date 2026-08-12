import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";
import { PCMBuffer } from "../../Domain/ValueObjects/PCMBuffer";
import { AudioSampleRate } from "../../Domain/ValueObjects/AudioSampleRate";
import { AudioBitDepth } from "../../Domain/ValueObjects/AudioBitDepth";
import { StreamingPolicy } from "../../Domain/Policies/StreamingPolicy";

export class PCMBufferAccumulator {
    private readonly buffer: number[] = [];
    private readonly maxSize: number;

    constructor(maxSize: number = 64 * 1024 * 1024) {
        this.maxSize = maxSize;
    }

    accumulate(chunk: AudioChunk): void {
        const data = new Uint8Array(chunk.getData());
        for (let i = 0; i < data.length; i++) {
            this.buffer.push(data[i]);
        }
    }

    getBuffer(): PCMBuffer {
        const arrayBuffer = new ArrayBuffer(this.buffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < this.buffer.length; i++) {
            view[i] = this.buffer[i];
        }
        return PCMBuffer.create(arrayBuffer, AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
    }

    clear(): void {
        this.buffer.length = 0;
    }

    getSize(): number {
        return this.buffer.length;
    }
}
