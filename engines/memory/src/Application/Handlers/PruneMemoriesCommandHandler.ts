import type { IEventBus } from "@nova-x-ai/core";
import { PruneMemoriesCommand } from "../Commands/PruneMemoriesCommand";
import { MemoryPruningResponseDto } from "../DTO/MemoryPruningResponseDto";
import { MemoryPrunedEvent } from "../../Domain/Events";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import { MemoryRetentionPolicy } from "../../Domain/Policies/MemoryRetentionPolicy";
import { MemoryDomainServiceImpl } from "../../Domain/Services/MemoryDomainServiceImpl";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class PruneMemoriesCommandHandler {
    constructor(
        private readonly repository: IMemoryRepository,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: PruneMemoriesCommand): Promise<MemoryPruningResponseDto> {
        if (!MemoryAuthorizationPolicy.canPrune(command.ownerId, command.claims.roles)) {
            throw new Error("Unauthorized: scheduler or admin role required for pruning.");
        }

        const domainService = new MemoryDomainServiceImpl({ repository: this.repository });
        const retentionPolicy = new MemoryRetentionPolicy({
            minSalience: command.minSalience,
            maxAgeMs: command.maxAgeMs
        });

        const allMemories = await this.repository.getByOwnerId(command.ownerId);
        const totalBefore = allMemories.length;

        const { prunedCount, prunedIds } = await domainService.pruneExpiredMemories(command.ownerId, retentionPolicy);

        const totalAfter = totalBefore - prunedCount;

        const correlationId = `mem-prune-${Date.now()}`;
        await this.eventBus.publish(
            new MemoryPrunedEvent(prunedCount, "retention-policy", Date.now(), correlationId)
        );

        return new MemoryPruningResponseDto(
            prunedCount,
            prunedIds,
            totalBefore,
            totalAfter,
            {
                minSalience: command.minSalience,
                maxAgeMs: command.maxAgeMs,
                maxAccessCount: 1
            },
            Date.now()
        );
    }
}
