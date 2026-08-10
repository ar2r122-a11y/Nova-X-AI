import { RelationshipMetrics } from "../../Domain/ValueObjects/RelationshipMetrics";
import { BondType } from "../../Domain/ValueObjects/BondType";

export class SocialGraphNodeDto {
    constructor(
        public readonly entityId: string,
        public readonly relationships: {
            targetId: string;
            bondType: BondType;
            status: string;
            metrics: RelationshipMetrics;
        }[],
        public readonly connectionCount: number
    ) {}

    static fromAggregates(entityId: string, aggregates: import("../../Domain/Aggregates/RelationshipAggregate").RelationshipAggregate[]): SocialGraphNodeDto {
        const relationships = aggregates.map(agg => ({
            targetId: agg.getTargetEntityId(),
            bondType: agg.getBondType(),
            status: agg.getRelationshipStatus(),
            metrics: agg.getMetrics()
        }));

        return new SocialGraphNodeDto(
            entityId,
            relationships,
            relationships.length
        );
    }
}
