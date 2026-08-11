import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { StorySummaryDto } from "../DTO/StorySummaryDto";

export interface StoryReadModel {
    getStory(storyId: string): Promise<StoryAggregateDto | null>;
    getAllStories(): Promise<StorySummaryDto[]>;
    saveStory(dto: StoryAggregateDto): Promise<void>;
    deleteStory(storyId: string): Promise<void>;
}
