import { AudioCodec } from "../../Domain/ValueObjects/AudioCodec";
import { PCMBuffer } from "../../Domain/ValueObjects/PCMBuffer";
import { AudioSampleRate } from "../../Domain/ValueObjects/AudioSampleRate";
import { AudioBitDepth } from "../../Domain/ValueObjects/AudioBitDepth";

export class AudioCompressionManager {
    async compress(buffer: PCMBuffer, targetCodec: AudioCodec): Promise<{ data: ArrayBuffer; codec: AudioCodec }> {
        if (targetCodec.getValue() === "pcm") {
            return { data: buffer.getData(), codec: targetCodec };
        }
        const data = new Uint8Array(buffer.getData());
        const compressed = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            compressed[i] = data[i];
        }
        return { data: compressed.buffer, codec: targetCodec };
    }

    async decompress(data: ArrayBuffer, codec: AudioCodec): Promise<PCMBuffer> {
        if (codec.getValue() === "pcm") {
            return PCMBuffer.create(data, AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
        }
        return PCMBuffer.create(data, AudioSampleRate.hz24000(), AudioBitDepth.bit16(), 1);
    }
}

export class AudioCodecManager {
    static getSupportedCodecs(): string[] {
        return ["pcm", "opus", "aac"];
    }

    static normalize(buffer: PCMBuffer, targetSampleRate: number, targetBitDepth: number): PCMBuffer {
        return buffer;
    }
}

export class PCMNormalizer {
    normalize(buffer: PCMBuffer): PCMBuffer {
        return buffer;
    }
}

export class OpusEncoder {
    encode(buffer: PCMBuffer): ArrayBuffer {
        return buffer.getData();
    }

    decode(data: ArrayBuffer): PCMBuffer {
        return PCMBuffer.create(data, { getValue: () => 24000 } as any, { getValue: () => 16 } as any, 1);
    }
}

export class AudioBufferPool {
    private readonly pool: PCMBuffer[] = [];
    private readonly maxSize: number;

    constructor(maxSize: number = 32) {
        this.maxSize = maxSize;
    }

    acquire(): PCMBuffer {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }
        return PCMBuffer.empty(
            { getValue: () => 24000 } as any,
            { getValue: () => 16 } as any,
            1
        );
    }

    release(buffer: PCMBuffer): void {
        if (this.pool.length < this.maxSize && !buffer.isEmpty()) {
            this.pool.push(buffer);
        }
    }

    clear(): void {
        this.pool.length = 0;
    }
}

export class LRUCache<K, V> {
    private readonly cache: Map<K, V> = new Map();
    private readonly maxSize: number;

    constructor(maxSize: number = 100) {
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        if (this.cache.has(key)) {
            const value = this.cache.get(key)!;
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return undefined;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, value);
    }

    delete(key: K): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}
