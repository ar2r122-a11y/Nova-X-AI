import type { RelationshipAggregate } from "../Aggregates/RelationshipAggregate";

export interface IRelationshipRepository {
    findById(relationshipId: string): Promise<RelationshipAggregate | null>;
    findByParticipants(sourceId: string, targetId: string): Promise<RelationshipAggregate | null>;
    save(aggregate: RelationshipAggregate): Promise<void>;
    delete(relationshipId: string): Promise<void>;
    getAll(): Promise<RelationshipAggregate[]>;
}
