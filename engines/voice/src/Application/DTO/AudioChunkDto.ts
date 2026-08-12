export class AudioChunkDto {
    constructor(
        public readonly sequence: number,
        public readonly chunkSizeBytes: number,
        public readonly codec: string,
        public readonly timestamp: number
    ) {}
}
