import { IQueryHandler } from "@nova-x-ai/core";
import { GetSocialGraphQuery } from "../Queries/GetSocialGraphQuery";
import { SocialGraphNodeDto } from "../DTO/SocialGraphNodeDto";
import { RelationshipNotFoundException } from "../../Domain/Exceptions";
import type { IRelationshipRepository } from "../../Domain/Repositories/IRelationshipRepository";

export class GetSocialGraphQueryHandler implements IQueryHandler<GetSocialGraphQuery, SocialGraphNodeDto> {
    constructor(private readonly repository: IRelationshipRepository) {}

    async handle(query: GetSocialGraphQuery): Promise<SocialGraphNodeDto> {
        const allRelationships = await this.repository.getAll();
        const entityRelationships = allRelationships.filter(
            r => r.getSourceEntityId() === query.entityId || r.getTargetEntityId() === query.entityId
        );

        if (entityRelationships.length === 0) {
            throw new RelationshipNotFoundException(query.entityId);
        }

        return SocialGraphNodeDto.fromAggregates(query.entityId, entityRelationships);
    }
}
