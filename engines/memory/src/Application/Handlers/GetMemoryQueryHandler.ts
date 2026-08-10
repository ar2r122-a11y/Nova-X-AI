import { GetMemoryQuery } from "../Queries/GetMemoryQuery";
import { MemoryRecordDto } from "../DTO/MemoryRecordDto";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class GetMemoryQueryHandler {
    constructor(
        private readonly repository: IMemoryRepository
    ) {}

    async handle(query: GetMemoryQuery): Promise<MemoryRecordDto | null> {
        if (!MemoryAuthorizationPolicy.canRecall(query.requesterId, query.requesterId, [])) {
            throw new Error("Unauthorized: requester cannot retrieve memories.");
        }

        const memory = await this.repository.getById(query.memoryId);
        if (!memory) {
            return null;
        }
        return MemoryRecordDto.fromEntity(memory);
    }
}
