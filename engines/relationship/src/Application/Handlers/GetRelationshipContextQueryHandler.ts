import { IQueryHandler } from "@nova-x-ai/core";
import { GetRelationshipContextQuery } from "../Queries/GetRelationshipContextQuery";
import { RelationshipContextDto } from "../DTO/RelationshipContextDto";
import { RelationshipNotFoundException } from "../../Domain/Exceptions";
import type { IRelationshipRepository } from "../../Domain/Repositories/IRelationshipRepository";

export class GetRelationshipContextQueryHandler implements IQueryHandler<GetRelationshipContextQuery, RelationshipContextDto> {
    constructor(private readonly repository: IRelationshipRepository) {}

    async handle(query: GetRelationshipContextQuery): Promise<RelationshipContextDto> {
        const snapshot = await this.repository.findById(query.relationshipId);
        if (!snapshot) {
            throw new RelationshipNotFoundException(query.relationshipId);
        }
        return RelationshipContextDto.fromAggregate(snapshot);
    }
}
