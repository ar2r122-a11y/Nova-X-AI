
import { CharacterStatus } from "../ValueObjects";
import { CharacterPersonality, CharacterRoutine } from "../Entities";
import { CharacterAggregate } from "../Aggregates";
import { EmotionalStateRef, CapabilityAction } from "../ValueObjects";

export interface ICharacterDomainService {
    validateStateTransition(current: CharacterStatus, target: CharacterStatus): boolean;
    calculateEmotionalImpact(event: string, personality: CharacterPersonality): { emotion: EmotionalStateRef; arousal: number };
    evaluateRoutine(routine: CharacterRoutine, worldTime: string): string;
    assessCapabilities(character: CharacterAggregate, action: CapabilityAction): boolean;
}
