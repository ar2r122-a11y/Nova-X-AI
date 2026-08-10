import type { EmotionAggregate } from "../Aggregates/EmotionAggregate";

export interface IEmotionRepository {
    findByCharacterId(characterId: string): Promise<EmotionAggregate | null>;
    save(aggregate: EmotionAggregate): Promise<void>;
}
