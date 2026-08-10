import { IQueryHandler } from "@nova-x-ai/core";
import type { ICharacterEngine } from "../../Contracts";
import { GetCharacterQuery } from "../Queries";
import { CharacterProfileDto } from "../DTO/CharacterProfileDto";
import { CharacterNotFoundException } from "../CharacterNotFoundException";
import { PrivacyBoundaryEnforcementPolicy } from "../../Domain/Policies/PrivacyBoundaryEnforcementPolicy";

export class GetCharacterQueryHandler implements IQueryHandler<GetCharacterQuery, CharacterProfileDto> {
    constructor(private readonly characterEngine: ICharacterEngine) {}

    async handle(query: GetCharacterQuery): Promise<CharacterProfileDto> {
        const repository = this.characterEngine.getRepository();
        const aggregate = await repository.findById(query.characterId);
        if (!aggregate) {
            throw new CharacterNotFoundException(query.characterId);
        }

        if (query.requesterId) {
            const policy = new PrivacyBoundaryEnforcementPolicy();
            const result = policy.enforce(aggregate, query.requesterId, []);
            if (!result.allowed) {
                throw new Error("Access denied: privacy boundary violation.");
            }
        }

        return CharacterProfileDto.fromAggregate(aggregate);
    }
}
