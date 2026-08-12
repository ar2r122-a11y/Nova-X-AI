
export class StreamingPolicy {
    private readonly maxChunkSize: number;
    private readonly maxConcurrentStreams: number;

    constructor(maxChunkSize: number = 65536, maxConcurrentStreams: number = 10) {
        this.maxChunkSize = maxChunkSize;
        this.maxConcurrentStreams = maxConcurrentStreams;
    }

    getMaxChunkSize(): number {
        return this.maxChunkSize;
    }

    getMaxConcurrentStreams(): number {
        return this.maxConcurrentStreams;
    }

    canStream(activeStreams: number): boolean {
        return activeStreams < this.maxConcurrentStreams;
    }
}
