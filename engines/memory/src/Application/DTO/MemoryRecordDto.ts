import type { VectorMetadata } from "../../Contracts/IMemoryEngine";

export class MemoryRecordDto {
    constructor(
        public readonly memoryId: string,
        public readonly memoryType: string,
        public readonly content: string,
        public readonly salience: number,
        public readonly ownerId: string,
        public readonly createdAt: number,
        public readonly updatedAt: number,
        public readonly lastAccessedAt: number,
        public readonly accessCount: number,
        public readonly state: string,
        public readonly tags: string[],
        public readonly contentHash: string,
        public readonly clusterId?: string,
        public readonly vectorMetadata?: VectorMetadata,
        public readonly sourceEventId?: string
    ) {}

    static fromEntity(memory: import("../../Domain/Entities/MemoryEntry").MemoryEntry): MemoryRecordDto {
        return new MemoryRecordDto(
            memory.getId().getValue(),
            memory.getType().getValue(),
            memory.getContent(),
            memory.getSalience().getValue(),
            memory.getOwnerId(),
            memory.getCreatedAt(),
            memory.getUpdatedAt(),
            memory.getLastAccessedAt(),
            memory.getAccessCount(),
            memory.getState().getValue(),
            memory.getTags(),
            memory.getContentHash().getValue(),
            memory.getClusterId()?.getValue(),
            memory.getVectorMetadata(),
            memory.getSourceEventId()
        );
    }
}
