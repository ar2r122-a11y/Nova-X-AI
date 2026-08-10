import type { IEventBus } from "@nova-x-ai/core";
import { CreateCharacterCommand } from "../Application/Commands";
import { UpdateCharacterTraitsCommand } from "../Application/Commands";
import { GetCharacterQuery, ListCharactersQuery } from "../Application/Queries";
import { CharacterProfileDto, CharacterSummaryDto } from "../Application/DTO";
import { CharacterAggregate } from "../Domain/Aggregates";
import type { ICharacterRepository } from "./ICharacterRepository";

export interface ICharacterEngine {
    readonly eventBus: IEventBus;
    createCharacter(command: CreateCharacterCommand): Promise<void>;
    updateCharacterTraits(command: UpdateCharacterTraitsCommand): Promise<void>;
    getCharacter(characterId: string): Promise<CharacterAggregate | null>;
    getCharacterById(query: GetCharacterQuery): Promise<CharacterProfileDto>;
    listCharacters(query: ListCharactersQuery): Promise<CharacterSummaryDto[]>;
    getActiveCharacters(): Promise<CharacterAggregate[]>;
    getAggregate(): Promise<CharacterAggregate | null>;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
    getRepository(): ICharacterRepository;
}
