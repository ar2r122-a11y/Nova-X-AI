import { ICommandHandler } from "@nova-x-ai/core";
import type { IEventBus } from "@nova-x-ai/core";
import type { ICharacterEngine } from "../../Contracts";
import { CreateCharacterCommand } from "../Commands";
import { CharacterCreatedEvent } from "../../Domain/Events";
import { CharacterAggregateFactory, CharacterInvariantsValidator } from "../../Domain/Services";
import { PersonalityTrait } from "../../Domain/ValueObjects";
import { CreateCharacterValidator } from "../Validators";

export class CreateCharacterCommandHandler implements ICommandHandler<CreateCharacterCommand> {
    constructor(
        private readonly characterEngine: ICharacterEngine,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: CreateCharacterCommand): Promise<void> {
        const validator = new CreateCharacterValidator();
        validator.validate(command);

        const repository = this.characterEngine.getRepository();
        const existingCharacters = await repository.getAll();
        const existingNames = existingCharacters.map((c) => c.getName());
        CharacterInvariantsValidator.validateNameUniqueness(command.name, existingNames);

        const traitsMap = new Map<string, PersonalityTrait>();
        for (const trait of command.traits) {
            traitsMap.set(trait.name, PersonalityTrait.create(trait.name, trait.score));
        }
        CharacterInvariantsValidator.validateTraitSchema(traitsMap);

        if (!command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: user claims must contain at least one role.");
        }

        const template = {
            name: command.name,
            title: command.title,
            origin: "",
            age: "",
            biography: command.biography,
            tagline: command.tagline,
            occupation: command.occupation,
            publicNotes: "",
            visualDescription: "",
            avatarUri: "",
            clothingStyle: "casual",
            distinguishingMarks: "",
            tone: "neutral",
            pitch: 1.0,
            speechTempo: "normal",
            vocabularyLevel: 0.5,
            dialectNotes: [] as string[],
            knownFacts: [] as string[],
            expertiseAreas: [] as string[],
            blindSpots: [] as string[],
            activeGoals: [] as Array<{ description: string; status: string; progress: number }>,
            motivations: [] as string[],
            schedule: [] as Array<{ timeBlock: string; activity: string; worldCoordinate?: string }>,
            fallbackBehavior: "idle",
            skillMatrix: [] as Array<{ skillName: string; level: number }>,
            inventoryItems: [] as Array<{ id: string; name: string; status: string; description?: string }>,
            affinityMap: [] as Array<{ targetId: string; trust: number; affection: number; familiarity: number }>,
            currentEmotion: "neutral",
            arousalLevel: 0.5,
            interactionCount: 0,
            evolutionStage: "initial",
            allowedActions: [] as string[],
            toolAccess: "user",
            privateBoundaries: [] as string[],
            accessControlList: [] as string[],
            currentLocation: "unknown",
            characterStatus: "unloaded",
            energyLevel: 1.0,
            moralAlignment: "neutral",
            quirks: [] as string[],
            fears: [] as string[],
            desires: [] as string[],
            traits: command.traits
        };

        const aggregate = CharacterAggregateFactory.createFromTemplate(template);
        await repository.save(aggregate);

        const correlationId = `char-create-${Date.now()}`;
        await this.eventBus.publish(
            new CharacterCreatedEvent(
                aggregate.getId(),
                command.name,
                Date.now(),
                correlationId
            )
        );
    }
}
