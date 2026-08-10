import type { IEventBus } from "@nova-x-ai/core";
import { EstablishRelationshipCommand } from "../Commands/EstablishRelationshipCommand";
import { RelationshipSnapshotDto } from "../DTO/RelationshipSnapshotDto";
import type { IRelationshipRepository } from "../../Domain/Repositories/IRelationshipRepository";
import { RelationshipAggregateFactory } from "../../Domain/Factories/RelationshipAggregateFactory";

export class EstablishRelationshipCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IRelationshipRepository
    ) {}

    async handle(command: EstablishRelationshipCommand): Promise<RelationshipSnapshotDto> {
        const existing = await this.repository.findByParticipants(command.sourceEntityId, command.targetEntityId);
        if (existing) {
            return RelationshipSnapshotDto.fromAggregate(existing);
        }

        const aggregate = RelationshipAggregateFactory.create(
            command.relationshipId,
            command.sourceEntityId,
            command.targetEntityId,
            command.bondType
        );

        aggregate.addSocialGraphAdjacency(command.targetEntityId);

        await this.repository.save(aggregate);

        aggregate.recordEstablishment();

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();

        return RelationshipSnapshotDto.fromAggregate(aggregate);
    }
}
