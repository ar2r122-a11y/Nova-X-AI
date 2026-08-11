import { IProjectionStore } from "@nova-x-ai/storage";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { StorySummaryDto } from "../DTO/StorySummaryDto";
import { StoryReadModel } from "./StoryReadModel";

export class StoryReadModelImpl implements StoryReadModel {
    private readonly storeKey = "story_read_model";

    constructor(private readonly projectionStore: IProjectionStore) {}

    async getStory(storyId: string): Promise<StoryAggregateDto | null> {
        const data = await this.projectionStore.getProjection(`${this.storeKey}:${storyId}`);
        return data as StoryAggregateDto | null;
    }

    async getAllStories(): Promise<StorySummaryDto[]> {
        const data = await this.projectionStore.getProjection(this.storeKey);
        if (!data || !Array.isArray(data)) {
            return [];
        }
        return data as StorySummaryDto[];
    }

    async saveStory(dto: StoryAggregateDto): Promise<void> {
        await this.projectionStore.saveProjection(`${this.storeKey}:${dto.storyId}`, dto);
        const all = await this.getAllStories();
        const existing = all.findIndex((s) => s.storyId === dto.storyId);
        const summary = StorySummaryDto.fromAggregate(dto as any);
        if (existing >= 0) {
            all[existing] = summary;
        } else {
            all.push(summary);
        }
        await this.projectionStore.saveProjection(this.storeKey, all);
    }

    async deleteStory(storyId: string): Promise<void> {
        await this.projectionStore.deleteProjection(`${this.storeKey}:${storyId}`);
        const all = await this.getAllStories();
        const filtered = all.filter((s) => s.storyId !== storyId);
        await this.projectionStore.saveProjection(this.storeKey, filtered);
    }
}
