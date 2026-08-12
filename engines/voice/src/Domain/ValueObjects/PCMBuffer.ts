export class PCMBuffer {
    private readonly data: ArrayBuffer;
    private readonly sampleRate: import("./AudioSampleRate").AudioSampleRate;
    private readonly bitDepth: import("./AudioBitDepth").AudioBitDepth;
    private readonly channels: number;

    private constructor(data: ArrayBuffer, sampleRate: import("./AudioSampleRate").AudioSampleRate, bitDepth: import("./AudioBitDepth").AudioBitDepth, channels: number) {
        this.data = data;
        this.sampleRate = sampleRate;
        this.bitDepth = bitDepth;
        this.channels = channels;
    }

    public static create(data: ArrayBuffer, sampleRate: import("./AudioSampleRate").AudioSampleRate, bitDepth: import("./AudioBitDepth").AudioBitDepth, channels: number): PCMBuffer {
        if (data.byteLength === 0) {
            throw new Error("PCMBuffer data cannot be empty.");
        }
        if (channels < 1 || channels > 2) {
            throw new Error("PCMBuffer channels must be 1 or 2.");
        }
        return new PCMBuffer(data, sampleRate, bitDepth, channels);
    }

    public static empty(sampleRate: import("./AudioSampleRate").AudioSampleRate, bitDepth: import("./AudioBitDepth").AudioBitDepth, channels: number): PCMBuffer {
        return new PCMBuffer(new ArrayBuffer(0), sampleRate, bitDepth, channels);
    }

    public getData(): ArrayBuffer {
        return this.data;
    }

    public getSampleRate(): import("./AudioSampleRate").AudioSampleRate {
        return this.sampleRate;
    }

    public getBitDepth(): import("./AudioBitDepth").AudioBitDepth {
        return this.bitDepth;
    }

    public getChannels(): number {
        return this.channels;
    }

    public getByteLength(): number {
        return this.data.byteLength;
    }

    public isEmpty(): boolean {
        return this.data.byteLength === 0;
    }

    public concat(other: PCMBuffer): PCMBuffer {
        const combined = new Uint8Array(this.data.byteLength + other.data.byteLength);
        combined.set(new Uint8Array(this.data));
        combined.set(new Uint8Array(other.data), this.data.byteLength);
        return PCMBuffer.create(combined.buffer, this.sampleRate, this.bitDepth, this.channels);
    }

    public slice(start: number, end: number): PCMBuffer {
        const sliced = new Uint8Array(this.data).slice(start, end);
        return PCMBuffer.create(sliced.buffer, this.sampleRate, this.bitDepth, this.channels);
    }
}
