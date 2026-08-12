import { PCMBuffer } from "../../Domain/ValueObjects/PCMBuffer";
import { AudioSampleRate } from "../../Domain/ValueObjects/AudioSampleRate";
import { AudioBitDepth } from "../../Domain/ValueObjects/AudioBitDepth";
import { AudioQualityPolicy } from "../../Domain/Policies/AudioQualityPolicy";

export class AudioRingBuffer {
    private readonly buffer: Uint8Array;
    private writeIndex = 0;
    private readIndex = 0;
    private filled = 0;

    constructor(private readonly capacity: number = 64 * 1024 * 1024) {
        this.buffer = new Uint8Array(capacity);
    }

    write(data: Uint8Array): boolean {
        if (this.remaining() < data.length) {
            return false;
        }
        for (let i = 0; i < data.length; i++) {
            this.buffer[this.writeIndex] = data[i];
            this.writeIndex = (this.writeIndex + 1) % this.capacity;
        }
        this.filled += data.length;
        return true;
    }

    read(length: number): Uint8Array {
        const result = new Uint8Array(Math.min(length, this.filled));
        for (let i = 0; i < result.length; i++) {
            result[i] = this.buffer[this.readIndex];
            this.readIndex = (this.readIndex + 1) % this.capacity;
        }
        this.filled -= result.length;
        return result;
    }

    clear(): void {
        this.writeIndex = 0;
        this.readIndex = 0;
        this.filled = 0;
    }

    available(): number {
        return this.filled;
    }

    remaining(): number {
        return this.capacity - this.filled;
    }

    toPCMBuffer(): PCMBuffer {
        const data = new Uint8Array(this.available());
        for (let i = 0; i < data.length; i++) {
            data[i] = this.buffer[(this.readIndex + i) % this.capacity];
        }
        return PCMBuffer.create(data.buffer, AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
    }
}
