import type { IEventBus } from "@nova-x-ai/core";
import { ConsolidateMemoriesCommand } from "../Commands/ConsolidateMemoriesCommand";
import { MemoryClusterDto } from "../DTO/MemoryClusterDto";
import { MemoryClusterFormedEvent } from "../../Domain/Events";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import { MemoryClusterId } from "../../Domain/ValueObjects/MemoryClusterId";
import { MemoryAggregate } from "../../Domain/Aggregates/MemoryAggregate";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class ConsolidateMemoriesCommandHandler {
    constructor(
        private readonly repository: IMemoryRepository,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: ConsolidateMemoriesCommand): Promise<MemoryClusterDto> {
        if (!MemoryAuthorizationPolicy.canConsolidate(command.ownerId, command.claims.roles)) {
            throw new Error("Unauthorized: scheduler or admin role required for consolidation.");
        }

        if (command.memoryIds.length < 2) {
            throw new Error("Consolidation requires at least 2 memories.");
        }

        const clusterId = command.clusterId ? MemoryClusterId.create(command.clusterId) : MemoryClusterId.generate();
        const memories: import("../../Domain/Entities/MemoryEntry").MemoryEntry[] = [];
        for (const id of command.memoryIds) {
            const memory = await this.repository.getById(id);
            if (memory) {
                memories.push(memory);
            }
        }

        const aggregate = MemoryAggregate.reconstitute(memories);
        aggregate.formCluster(clusterId, memories.map((m) => m.getId()));

        for (const memory of memories) {
            memory.consolidate(clusterId);
            await this.repository.save(memory);
        }

        const correlationId = `mem-consolidate-${Date.now()}`;
        await this.eventBus.publish(
            new MemoryClusterFormedEvent(clusterId, command.memoryIds, Date.now(), correlationId)
        );

        return new MemoryClusterDto(
            clusterId.getValue(),
            command.memoryIds,
            command.memoryIds.length,
            Date.now(),
            Date.now()
        );
    }
}
