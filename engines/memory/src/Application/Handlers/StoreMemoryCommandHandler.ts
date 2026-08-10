import type { IEventBus } from "@nova-x-ai/core";
import { StoreMemoryCommand } from "../Commands/StoreMemoryCommand";
import { MemoryRecordDto } from "../DTO/MemoryRecordDto";
import { MemoryStoredEvent } from "../../Domain/Events";
import { MemoryAuthorizationPolicy, MemoryImportancePolicy } from "../../Domain/Policies";
import { ContentHash } from "../../Domain/ValueObjects/ContentHash";
import { MemoryTypeRef } from "../../Domain/ValueObjects/MemoryType";
import { VectorMetadata } from "../../Domain/ValueObjects/VectorMetadata";
import { MemorySalience } from "../../Domain/ValueObjects/MemorySalience";
import { MemoryClusterId } from "../../Domain/ValueObjects/MemoryClusterId";
import { MemoryAggregate } from "../../Domain/Aggregates/MemoryAggregate";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class StoreMemoryCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IMemoryRepository
    ) {}

    async handle(command: StoreMemoryCommand): Promise<MemoryRecordDto> {
        if (!MemoryAuthorizationPolicy.canStore(command.ownerId, command.ownerId, command.claims.roles)) {
            throw new Error("Unauthorized: user is not authorized to store memories.");
        }

        if (typeof command.salience !== "number" || command.salience < 0.0 || command.salience > 1.0) {
            throw new Error("Salience must be between 0.0 and 1.0.");
        }

        const contentHash = ContentHash.compute(command.content);
        const typeRef = MemoryTypeRef.create(command.memoryType);
        const salience = MemoryImportancePolicy.calculateBaseImportance(typeRef, 0, 0);
        const finalSalience = MemorySalience.create(Math.max(command.salience, salience));
        const vectorMetadata = command.vector ? VectorMetadata.create(command.vector) : undefined;

        const memoryEntry = {
            content: command.content,
            type: typeRef,
            salience: finalSalience,
            contentHash,
            ownerId: command.ownerId,
            clusterId: command.clusterId ? MemoryClusterId.create(command.clusterId) : undefined,
            vectorMetadata,
            tags: command.tags,
            sourceEventId: command.sourceEventId,
            decayRate: 0.01
        };

        const aggregate = new MemoryAggregate();
        const stored = aggregate.storeMemory(memoryEntry);
        await this.repository.save(stored);
        const dto = MemoryRecordDto.fromEntity(stored);

        const correlationId = `mem-store-${Date.now()}`;
        await this.eventBus.publish(
            new MemoryStoredEvent(stored.getId(), typeRef, command.ownerId, Date.now(), correlationId)
        );

        return dto;
    }
}
