import type { RelationshipAggregate } from "../Aggregates/RelationshipAggregate";

export interface IRelationshipDomainService {
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
    }): void;
    evaluateDecay(aggregate: RelationshipAggregate, elapsedMs: number): void;
}
