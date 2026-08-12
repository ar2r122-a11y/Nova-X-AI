import { AudioChunkSequence } from "./AudioChunkSequence";
import { AudioCodec } from "./AudioCodec";

export class AudioChunk {
    private readonly sequence: AudioChunkSequence;
    private readonly data: ArrayBuffer;
    private readonly timestamp: number;
    private readonly isLast: boolean;
    private readonly codec: AudioCodec;

    private constructor(sequence: AudioChunkSequence, data: ArrayBuffer, timestamp: number, isLast: boolean, codec: AudioCodec) {
        this.sequence = sequence;
        this.data = data;
        this.timestamp = timestamp;
        this.isLast = isLast;
        this.codec = codec;
    }

    public static create(sequence: AudioChunkSequence, data: ArrayBuffer, timestamp: number, isLast: boolean, codec: AudioCodec): AudioChunk {
        if (data.byteLength === 0) {
            throw new Error("AudioChunk data cannot be empty.");
        }
        return new AudioChunk(sequence, data, timestamp, isLast, codec);
    }

    public static initial(data: ArrayBuffer): AudioChunk {
        return AudioChunk.create(AudioChunkSequence.initial(), data, Date.now(), false, AudioCodec.pcm());
    }

    public getSequence(): AudioChunkSequence {
        return this.sequence;
    }

    public getData(): ArrayBuffer {
        return this.data;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }

    public getIsLast(): boolean {
        return this.isLast;
    }

    public getCodec(): AudioCodec {
        return this.codec;
    }

    public getByteLength(): number {
        return this.data.byteLength;
    }
}
