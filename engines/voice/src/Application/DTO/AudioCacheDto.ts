export class AudioCacheDto {
    constructor(
        public readonly voiceId: string,
        public readonly cachedItems: number,
        public readonly totalBytes: number,
        public readonly oldestCachedAt: number | null
    ) {}
}
