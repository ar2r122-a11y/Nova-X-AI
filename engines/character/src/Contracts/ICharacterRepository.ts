import { CharacterAggregate } from "../Domain/Aggregates";

export interface ICharacterRepository {
    findById(id: string): Promise<CharacterAggregate | null>;
    save(aggregate: CharacterAggregate): Promise<void>;
    delete(id: string): Promise<void>;
    exists(id: string): Promise<boolean>;
    getAll(): Promise<CharacterAggregate[]>;
    getActiveCharacters(): Promise<CharacterAggregate[]>;
}
