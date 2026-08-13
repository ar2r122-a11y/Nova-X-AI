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
            origin: command.origin,
            age: command.age,
            biography: command.biography,
            tagline: command.tagline,
            occupation: command.occupation,
            publicNotes: "",
            visualDescription: command.visualDescription,
            avatarUri: "",
            clothingStyle: command.clothingStyle || "casual",
            distinguishingMarks: command.distinguishingMarks || "",
            tone: command.tone || "neutral",
            pitch: 1.0,
            speechTempo: command.speakingStyle || "normal",
            vocabularyLevel: 0.5,
            dialectNotes: command.dialectNotes || [],
            knownFacts: [],
            expertiseAreas: [],
            blindSpots: [],
            activeGoals: (command.goals || []).map((description) => ({ description, status: "active", progress: 0 })),
            motivations: command.interests || [],
            schedule: [],
            fallbackBehavior: "idle",
            skillMatrix: [],
            inventoryItems: [],
            affinityMap: [],
            currentEmotion: "neutral",
            arousalLevel: 0.5,
            interactionCount: 0,
            evolutionStage: "initial",
            allowedActions: [],
            toolAccess: "user",
            privateBoundaries: [],
            accessControlList: [],
            currentLocation: "unknown",
            characterStatus: "active",
            energyLevel: 1.0,
            moralAlignment: command.moralAlignment || "neutral",
            quirks: (command.quirks || []).map((q: any) => typeof q === "string" ? q : String(q)),
            fears: (command.fears || []).map((f: any) => typeof f === "string" ? f : String(f)),
            desires: (command.desires || []).map((d: any) => typeof d === "string" ? d : String(d)),
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
