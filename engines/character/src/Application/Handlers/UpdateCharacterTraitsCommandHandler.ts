import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { ICharacterEngine } from "../../Contracts";
import { UpdateCharacterTraitsCommand } from "../Commands";
import { CharacterNotFoundException } from "../CharacterNotFoundException";
import { CharacterTraitsUpdatedEvent } from "../../Domain/Events";
import { CharacterInvariantsValidator } from "../../Domain/Services";
import { AuthorizationPolicy } from "../../Domain/Policies/AuthorizationPolicy";
import { PersonalityTrait } from "../../Domain/ValueObjects";
import { UpdateCharacterTraitsValidator } from "../Validators";

export class UpdateCharacterTraitsCommandHandler implements ICommandHandler<UpdateCharacterTraitsCommand> {
    constructor(
        private readonly characterEngine: ICharacterEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: UpdateCharacterTraitsCommand): Promise<void> {
        const validator = new UpdateCharacterTraitsValidator();
        validator.validate(command);

        const repository = this.characterEngine.getRepository();
        const aggregate = await repository.findById(command.characterId);
        if (!aggregate) {
            throw new CharacterNotFoundException(command.characterId);
        }

        const ownerId = aggregate.getId().getValue();
        const policy = new AuthorizationPolicy();
        const isAuthorized = policy.canUpdateTraits(command.requesterId, ownerId, command.claims.roles);
        if (!isAuthorized) {
            throw new Error("Unauthorized: requester is not the owner or an admin.");
        }

        const traitsMap = new Map<string, PersonalityTrait>();
        for (const trait of command.traits) {
            traitsMap.set(trait.name, PersonalityTrait.create(trait.name, trait.score));
        }
        CharacterInvariantsValidator.validateTraitSchema(traitsMap);

        aggregate.updateTraits(traitsMap);
        await repository.save(aggregate);

        const correlationId = `char-traits-${Date.now()}`;
        await this.eventBus.publish(
            new CharacterTraitsUpdatedEvent(
                aggregate.getId(),
                command.traits.map((t) => t.name),
                correlationId
            )
        );
    }
}
