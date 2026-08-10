import type { IEventBus } from "@nova-x-ai/core";
import { UpdateRelationshipMetricsCommand } from "../Commands/UpdateRelationshipMetricsCommand";
import { RelationshipSnapshotDto } from "../DTO/RelationshipSnapshotDto";
import { RelationshipNotFoundException } from "../../Domain/Exceptions";
import type { IRelationshipRepository } from "../../Domain/Repositories/IRelationshipRepository";
import { RelationshipDomainServiceImpl } from "../../Domain/Services/RelationshipDomainServiceImpl";
import { RelationshipMetricsCalculator } from "../../Domain/Calculators/RelationshipMetricsCalculator";

export class UpdateRelationshipMetricsCommandHandler {
    private readonly domainService: RelationshipDomainServiceImpl;
    private readonly calculator: RelationshipMetricsCalculator;

    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IRelationshipRepository
    ) {
        this.domainService = new RelationshipDomainServiceImpl();
        this.calculator = new RelationshipMetricsCalculator();
    }

    async handle(command: UpdateRelationshipMetricsCommand): Promise<RelationshipSnapshotDto> {
        const aggregate = await this.repository.findById(command.relationshipId);
        if (!aggregate) {
            throw new RelationshipNotFoundException(command.relationshipId);
        }

        const trustDelta = command.trustDelta !== 0 ? command.trustDelta : this.calculator.calculateTrustDelta(aggregate, command.interactionType, command.emotionalValence);
        const affinityDelta = command.affinityDelta !== 0 ? command.affinityDelta : this.calculator.calculateAffinityDelta(aggregate, command.interactionType, command.emotionalValence);
        const respectDelta = command.respectDelta !== 0 ? command.respectDelta : this.calculator.calculateRespectDelta(aggregate, command.interactionType, command.emotionalValence);
        const loyaltyDelta = command.loyaltyDelta !== 0 ? command.loyaltyDelta : this.calculator.calculateLoyaltyDelta(aggregate, command.interactionType, command.emotionalValence);

        this.domainService.processInteraction(aggregate, {
            sourceEntityId: aggregate.getSourceEntityId(),
            targetEntityId: aggregate.getTargetEntityId(),
            interactionType: command.interactionType,
            emotionalValence: command.emotionalValence,
            contextTags: command.contextTags,
            sharedMemoryIds: command.sharedMemoryIds,
            trustDelta,
            affinityDelta,
            respectDelta,
            loyaltyDelta
        });

        await this.repository.save(aggregate);

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();

        return RelationshipSnapshotDto.fromAggregate(aggregate);
    }
}
