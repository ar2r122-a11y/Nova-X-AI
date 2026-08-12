export class VoiceSynthesisResultDto {
    constructor(
        public readonly requestId: string,
        public readonly voiceId: string,
        public readonly status: string,
        public readonly durationMs: number,
        public readonly totalChunks: number,
        public readonly providerId: string,
        public readonly estimatedCostMicros: number,
        public readonly correlationId: string
    ) {}
}
