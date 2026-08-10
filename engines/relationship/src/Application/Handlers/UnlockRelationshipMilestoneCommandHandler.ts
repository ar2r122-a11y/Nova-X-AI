import type { IEventBus } from "@nova-x-ai/core";
import { UnlockRelationshipMilestoneCommand } from "../Commands/UnlockRelationshipMilestoneCommand";
import { RelationshipNotFoundException } from "../../Domain/Exceptions";
import type { IRelationshipRepository } from "../../Domain/Repositories/IRelationshipRepository";
import { MilestoneDescriptor } from "../../Domain/ValueObjects/MilestoneDescriptor";

export class UnlockRelationshipMilestoneCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IRelationshipRepository
    ) {}

    async handle(command: UnlockRelationshipMilestoneCommand): Promise<void> {
        const aggregate = await this.repository.findById(command.relationshipId);
        if (!aggregate) {
            throw new RelationshipNotFoundException(command.relationshipId);
        }

        const milestone = MilestoneDescriptor.create(
            command.milestoneId,
            command.name,
            command.description,
            command.requiredTrust,
            command.requiredAffinity,
            command.requiredRespect,
            command.requiredLoyalty,
            command.requiredBondType
        );

        aggregate.unlockMilestone(milestone);
        await this.repository.save(aggregate);

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();
    }
}
