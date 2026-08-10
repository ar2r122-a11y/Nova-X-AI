export class MemoryPruningResponseDto {
    constructor(
        public readonly prunedCount: number,
        public readonly prunedMemoryIds: string[],
        public readonly totalBefore: number,
        public readonly totalAfter: number,
        public readonly threshold: {
            minSalience: number;
            maxAgeMs: number;
            maxAccessCount: number;
        },
        public readonly executedAt: number
    ) {}
}
