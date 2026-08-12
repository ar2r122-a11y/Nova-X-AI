export class VoiceBudgetDto {
    constructor(
        public readonly voiceId: string,
        public readonly hardLatencyMs: number,
        public readonly softLatencyMs: number,
        public readonly audioRingBufferBytes: number,
        public readonly networkBitrateKbps: number,
        public readonly maxInputCharacters: number,
        public readonly chunkSizeBytes: number,
        public readonly usedLatencyMs: number,
        public readonly usedRingBufferBytes: number,
        public readonly usedBitrateKbps: number
    ) {}
}
