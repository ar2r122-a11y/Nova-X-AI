import { GetMemoryContextQuery } from "../Queries/GetMemoryContextQuery";
import { MemoryContextDto } from "../DTO/MemoryContextDto";
import { MemoryRecordDto } from "../DTO/MemoryRecordDto";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class GetMemoryContextQueryHandler {
    constructor(
        private readonly repository: IMemoryRepository
    ) {}

    async handle(query: GetMemoryContextQuery): Promise<MemoryContextDto> {
        if (!MemoryAuthorizationPolicy.canRecall(query.requesterId, query.ownerId, [])) {
            throw new Error("Unauthorized: requester cannot retrieve memory context for this owner.");
        }

        const allMemories = await this.repository.getByOwnerId(query.ownerId);
        let filtered = allMemories.filter((m) => m.getState().isActive());
        if (query.memoryTypes.length > 0) {
            filtered = filtered.filter((m) => query.memoryTypes.includes(m.getType().getValue()));
        }

        const sorted = filtered
            .sort((a, b) => b.getSalience().getValue() - a.getSalience().getValue())
            .slice(0, 20);

        const dtos = sorted.map((m) => MemoryRecordDto.fromEntity(m));
        const contextBlock = this.buildMemoryBlock(dtos);
        const estimatedTokens = Math.ceil(contextBlock.length / 4);

        return new MemoryContextDto(query.ownerId, dtos, estimatedTokens, contextBlock);
    }

    private buildMemoryBlock(memories: MemoryRecordDto[]): string {
        if (memories.length === 0) {
            return "Recent Memories: None";
        }
        return `Recent Memories:\n${memories.map((m, i) => `${i + 1}. ${m.content}`).join("\n")}`;
    }
}
