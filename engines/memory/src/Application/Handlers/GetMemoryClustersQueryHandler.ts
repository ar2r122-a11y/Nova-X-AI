import { GetMemoryClustersQuery } from "../Queries/GetMemoryClustersQuery";
import { MemoryClusterDto } from "../DTO/MemoryClusterDto";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class GetMemoryClustersQueryHandler {
    constructor(
        private readonly repository: IMemoryRepository
    ) {}

    async handle(query: GetMemoryClustersQuery): Promise<MemoryClusterDto[]> {
        if (!MemoryAuthorizationPolicy.canRecall(query.requesterId, query.ownerId, [])) {
            throw new Error("Unauthorized: requester cannot retrieve memory clusters for this owner.");
        }

        const allMemories = await this.repository.getByOwnerId(query.ownerId);
        const clusterMap = new Map<string, import("../../Domain/Entities/MemoryEntry").MemoryEntry[]>();
        for (const memory of allMemories) {
            const clusterId = memory.getClusterId();
            if (clusterId) {
                const key = clusterId.getValue();
                const existing = clusterMap.get(key) ?? [];
                existing.push(memory);
                clusterMap.set(key, existing);
            }
        }

        const result: MemoryClusterDto[] = [];
        for (const [clusterId, members] of clusterMap.entries()) {
            result.push(new MemoryClusterDto(
                clusterId,
                members.map((m) => m.getId().getValue()),
                members.length,
                Math.min(...members.map((m) => m.getCreatedAt())),
                Math.max(...members.map((m) => m.getUpdatedAt()))
            ));
        }
        return result;
    }
}
