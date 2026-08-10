import { IQueryHandler } from "@nova-x-ai/core";
import { GetRelationshipQuery } from "../Queries/GetRelationshipQuery";
import { RelationshipSnapshotDto } from "../DTO/RelationshipSnapshotDto";
import { RelationshipNotFoundException } from "../../Domain/Exceptions";
import type { IRelationshipRepository } from "../../Domain/Repositories/IRelationshipRepository";

export class GetRelationshipQueryHandler implements IQueryHandler<GetRelationshipQuery, RelationshipSnapshotDto> {
    constructor(private readonly repository: IRelationshipRepository) {}

    async handle(query: GetRelationshipQuery): Promise<RelationshipSnapshotDto> {
        const snapshot = await this.repository.findById(query.relationshipId);
        if (!snapshot) {
            throw new RelationshipNotFoundException(query.relationshipId);
        }
        return RelationshipSnapshotDto.fromAggregate(snapshot);
    }
}
