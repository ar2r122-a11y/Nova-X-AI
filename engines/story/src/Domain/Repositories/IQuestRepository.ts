import { QuestId } from "../ValueObjects/QuestId";
import { StoryId } from "../ValueObjects/StoryId";
import { QuestAggregate } from "../Aggregates/QuestAggregate";

export interface IQuestRepository {
    save(quest: QuestAggregate): Promise<void>;
    getById(questId: QuestId): Promise<QuestAggregate | null>;
    getByStoryId(storyId: StoryId): Promise<QuestAggregate[]>;
    delete(questId: QuestId): Promise<void>;
}
