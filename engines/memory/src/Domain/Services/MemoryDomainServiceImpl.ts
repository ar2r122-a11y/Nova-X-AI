import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";
import { MemoryAggregate } from "../../Domain/Aggregates/MemoryAggregate";
import { MemoryRetentionPolicy } from "../../Domain/Policies/MemoryRetentionPolicy";

export interface MemoryDomainServiceOptions {
    repository: IMemoryRepository;
}

export class MemoryDomainServiceImpl {
    private readonly repository: IMemoryRepository;

    constructor(options: MemoryDomainServiceOptions) {
        this.repository = options.repository;
    }

    async retrieveMemoriesForContext(ownerId: string, _query: string, limit: number = 10): Promise<MemoryAggregate[]> {
        const allMemories = await this.repository.getByOwnerId(ownerId);
        const activeMemories = allMemories
            .filter((m) => m.getState().isActive())
            .sort((a, b) => b.getSalience().getValue() - a.getSalience().getValue())
            .slice(0, limit);
        return [MemoryAggregate.reconstitute(activeMemories)];
    }

    async applyDecayToAll(_decayRate: number): Promise<void> {
        const allMemories = await this.repository.getAll();
        const aggregate = MemoryAggregate.reconstitute(allMemories);
        aggregate.decayAllMemories(_decayRate);
        for (const memory of aggregate.getAllMemories()) {
            await this.repository.save(memory);
        }
    }

    async pruneExpiredMemories(ownerId: string, retentionPolicy: MemoryRetentionPolicy): Promise<{ prunedCount: number; prunedIds: string[] }> {
        const allMemories = await this.repository.getByOwnerId(ownerId);
        const expired = retentionPolicy.getExpiredMemories(allMemories);
        const prunedIds: string[] = [];
        for (const memory of expired) {
            memory.forget();
            await this.repository.save(memory);
            prunedIds.push(memory.getId().getValue());
        }
        return { prunedCount: prunedIds.length, prunedIds };
    }
}
