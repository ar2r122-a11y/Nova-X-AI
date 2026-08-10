import { CharacterPromptContextDto } from "../Application/DTO";
import { CharacterAggregate } from "../Domain/Aggregates";

export interface ICharacterContextBuilder {
    buildPromptContext(character: CharacterAggregate, memories?: string[], tokenLimit?: number): CharacterPromptContextDto;
}
