import type { MemoryRecordDto } from "./MemoryRecordDto";

export class MemoryRetrievalResultDto {
    constructor(
        public readonly memory: MemoryRecordDto,
        public readonly similarityScore: number,
        public readonly relevanceRank: number
    ) {}
}
