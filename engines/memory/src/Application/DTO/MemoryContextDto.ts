import type { MemoryRecordDto } from "./MemoryRecordDto";

export class MemoryContextDto {
    constructor(
        public readonly ownerId: string,
        public readonly memories: MemoryRecordDto[],
        public readonly estimatedTokens: number,
        public readonly contextBlock: string
    ) {}
}
