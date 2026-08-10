import { IRelationshipDomainService } from "./IRelationshipDomainService";
import type { RelationshipAggregate } from "../Aggregates/RelationshipAggregate";

export class RelationshipDomainServiceImpl implements IRelationshipDomainService {
    processInteraction(aggregate: RelationshipAggregate, interaction: {
        sourceEntityId: string;
        targetEntityId: string;
        interactionType: string;
        emotionalValence: number;
        contextTags: string[];
        sharedMemoryIds: string[];
        trustDelta: number;
        affinityDelta: number;
        respectDelta: number;
        loyaltyDelta: number;
    }): void {
        aggregate.processInteraction(interaction);
    }

    evaluateDecay(aggregate: RelationshipAggregate, elapsedMs: number): void {
        aggregate.executeDecayTick(elapsedMs);
    }
}
