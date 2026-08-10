import { GetMemoriesForCharacterQuery } from "../Queries/GetMemoriesForCharacterQuery";
import { MemoryRecordDto } from "../DTO/MemoryRecordDto";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class GetMemoriesForCharacterQueryHandler {
    constructor(
        private readonly repository: IMemoryRepository
    ) {}

    async handle(query: GetMemoriesForCharacterQuery): Promise<MemoryRecordDto[]> {
        if (!MemoryAuthorizationPolicy.canRecall(query.requesterId, query.ownerId, [])) {
            throw new Error("Unauthorized: requester cannot retrieve memories for this owner.");
        }

        const memories = await this.repository.getActiveMemories(query.ownerId);
        const filtered = memories.filter((m) => m.getSalience().isAbove(query.minSalience));
        const sorted = filtered.sort((a, b) => b.getSalience().getValue() - a.getSalience().getValue());
        return sorted.slice(0, query.limit).map((m) => MemoryRecordDto.fromEntity(m));
    }
}
