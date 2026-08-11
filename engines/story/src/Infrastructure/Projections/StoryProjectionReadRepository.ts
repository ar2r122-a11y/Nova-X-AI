import { IProjectionStore } from "@nova-x-ai/storage";
import { StoryAggregateDto } from "../../Application/DTO/StoryAggregateDto";
import { StoryReadModel } from "../../Application/Projections/StoryReadModel";
import { StoryReadModelImpl } from "../../Application/Projections/StoryReadModelImpl";

export class StoryProjectionReadRepository implements StoryReadModel {
    private readonly readModel: StoryReadModelImpl;

    constructor(projectionStore: IProjectionStore) {
        this.readModel = new StoryReadModelImpl(projectionStore);
    }

    async getStory(storyId: string): Promise<StoryAggregateDto | null> {
        return this.readModel.getStory(storyId);
    }

    async getAllStories(): Promise<StoryAggregateDto[]> {
        const summaries = await this.readModel.getAllStories();
        const result: StoryAggregateDto[] = [];
        for (const summary of summaries) {
            const full = await this.readModel.getStory(summary.storyId);
            if (full) {
                result.push(full);
            }
        }
        return result;
    }

    async saveStory(dto: StoryAggregateDto): Promise<void> {
        return this.readModel.saveStory(dto);
    }

    async deleteStory(storyId: string): Promise<void> {
        return this.readModel.deleteStory(storyId);
    }
}
