import type { IEventBus } from "@nova-x-ai/core";
import { ExecuteRelationshipDecayCommand } from "../Commands/ExecuteRelationshipDecayCommand";
import { RelationshipNotFoundException } from "../../Domain/Exceptions";
import type { IRelationshipRepository } from "../../Domain/Repositories/IRelationshipRepository";
import { RelationshipDomainServiceImpl } from "../../Domain/Services/RelationshipDomainServiceImpl";

export class ExecuteRelationshipDecayCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IRelationshipRepository
    ) {
        this.domainService = new RelationshipDomainServiceImpl();
    }
    private readonly domainService: RelationshipDomainServiceImpl;

    async handle(command: ExecuteRelationshipDecayCommand): Promise<void> {
        const aggregate = await this.repository.findById(command.relationshipId);
        if (!aggregate) {
            throw new RelationshipNotFoundException(command.relationshipId);
        }

        this.domainService.evaluateDecay(aggregate, command.deltaTimeMs);
        await this.repository.save(aggregate);

        const events = aggregate.getUncommittedEvents();
        for (const event of events) {
            await this.eventBus.publish(event);
        }
        aggregate.commitEvents();
    }
}
