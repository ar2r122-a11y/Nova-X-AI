import { GetMemoriesByTypeQuery } from "../Queries/GetMemoriesByTypeQuery";
import { MemoryRecordDto } from "../DTO/MemoryRecordDto";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class GetMemoriesByTypeQueryHandler {
    constructor(
        private readonly repository: IMemoryRepository
    ) {}

    async handle(query: GetMemoriesByTypeQuery): Promise<MemoryRecordDto[]> {
        if (!MemoryAuthorizationPolicy.canRecall(query.requesterId, query.ownerId, [])) {
            throw new Error("Unauthorized: requester cannot retrieve memories for this owner.");
        }

        const memories = await this.repository.getByType(query.ownerId, query.memoryType);
        return memories.slice(0, query.limit).map((m) => MemoryRecordDto.fromEntity(m));
    }
}
