import type { IEventBus } from "@nova-x-ai/core";
import type { ICharacterRepository } from "../Contracts/ICharacterRepository";
import type { ICharacterContextBuilder } from "../Contracts/ICharacterContextBuilder";
import type { ICharacterWorker } from "../Contracts/ICharacterWorker";
import { CharacterAggregate } from "../Domain/Aggregates";
import { CharacterAggregateFactory, CharacterInvariantsValidator } from "../Domain/Services";
import { AuthorizationPolicy } from "../Domain/Policies/AuthorizationPolicy";
import { PersonalityTrait } from "../Domain/ValueObjects";
import { CharacterCreatedEvent, CharacterTraitsUpdatedEvent } from "../Domain/Events";
import { CreateCharacterCommand, UpdateCharacterTraitsCommand } from "../Application/Commands";
import { GetCharacterQuery, ListCharactersQuery } from "../Application/Queries";
import { CharacterProfileDto, CharacterSummaryDto } from "../Application/DTO";
import { CharacterNotFoundException } from "../Application/CharacterNotFoundException";
import { CharacterRoutineWorker, CharacterEvolutionWorker, CharacterCacheWorker } from "./Workers";
import type { ICharacterEngine } from "../Contracts/ICharacterEngine";

export class CharacterEngine implements ICharacterEngine {
    readonly eventBus: IEventBus;
    private repository: ICharacterRepository;
    private workers: ICharacterWorker[] = [];
    private initialized = false;

    constructor(
        eventBus: IEventBus,
        repository: ICharacterRepository,
        _contextBuilder: ICharacterContextBuilder
    ) {
        this.eventBus = eventBus;
        this.repository = repository;
    }

    getRepository(): ICharacterRepository {
        return this.repository;
    }

    async createCharacter(command: CreateCharacterCommand): Promise<void> {
        const existingCharacters = await this.repository.getAll();
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
        await this.repository.save(aggregate);

        const correlationId = `char-create-${Date.now()}`;
        await this.eventBus.publish(
            new CharacterCreatedEvent(aggregate.getId(), command.name, Date.now(), correlationId)
        );
    }

    async updateCharacterTraits(command: UpdateCharacterTraitsCommand): Promise<void> {
        const aggregate = await this.repository.findById(command.characterId);
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
        await this.repository.save(aggregate);

        const correlationId = `char-traits-${Date.now()}`;
        await this.eventBus.publish(
            new CharacterTraitsUpdatedEvent(aggregate.getId(),                 command.traits.map((t: {name: string; score: number}) => t.name), correlationId)
        );
    }

    async getCharacter(characterId: string): Promise<CharacterAggregate | null> {
        return this.repository.findById(characterId);
    }

    async getCharacterById(query: GetCharacterQuery): Promise<CharacterProfileDto> {
        const aggregate = await this.repository.findById(query.characterId);
        if (!aggregate) {
            throw new CharacterNotFoundException(query.characterId);
        }
        return CharacterProfileDto.fromAggregate(aggregate);
    }

    async listCharacters(query: ListCharactersQuery): Promise<CharacterSummaryDto[]> {
        const all = await this.repository.getAll();
        let filtered = all;

        if (query.ownerId) {
            filtered = filtered.filter((c) => c.getId().getValue() === query.ownerId);
        }
        if (query.status) {
            filtered = filtered.filter((c) => c.getState().status.getValue() === query.status);
        }

        const limit = query.limit || 50;
        return filtered.slice(0, limit).map((aggregate) => {
            const identity = aggregate.getIdentity();
            const statistics = aggregate.getStatistics();
            const state = aggregate.getState();
            return new CharacterSummaryDto(
                identity.id.getValue(),
                identity.name,
                identity.title,
                state.status.getValue(),
                statistics.evolutionStage.getValue(),
                statistics.interactionCount,
                Date.now()
            );
        });
    }

    async getActiveCharacters(): Promise<CharacterAggregate[]> {
        return this.repository.getActiveCharacters();
    }

    async getAggregate(): Promise<CharacterAggregate | null> {
        const active = await this.getActiveCharacters();
        return active.length > 0 ? active[0] : null;
    }

    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        const routineWorker = new CharacterRoutineWorker();
        const evolutionWorker = new CharacterEvolutionWorker();
        const cacheWorker = new CharacterCacheWorker();

        routineWorker.setCharacterEngine(this);
        evolutionWorker.setCharacterEngine(this);
        cacheWorker.setCharacterEngine(this);

        this.workers = [routineWorker, evolutionWorker, cacheWorker];

        for (const worker of this.workers) {
            await worker.start();
        }

        this.initialized = true;
    }

    async shutdown(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        this.workers = [];
        this.initialized = false;
    }
}
