export class StreamingPolicy {
    static readonly MAX_CONCURRENT_STREAMS = 8;
    static readonly CHUNK_SIZE_BYTES = 4096;
    static readonly JITTER_BUFFER_MS = 50;
    static readonly MAX_DROPPED_CHUNKS = 10;

    static canStartStream(currentStreams: number): boolean {
        return currentStreams < StreamingPolicy.MAX_CONCURRENT_STREAMS;
    }

    static getChunkSize(): number {
        return StreamingPolicy.CHUNK_SIZE_BYTES;
    }

    static getJitterBufferMs(): number {
        return StreamingPolicy.JITTER_BUFFER_MS;
    }
}
