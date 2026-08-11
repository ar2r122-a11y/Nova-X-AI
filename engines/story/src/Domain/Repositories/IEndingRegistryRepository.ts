import { StoryId } from "../ValueObjects/StoryId";
import { EndingRegistryAggregate } from "../Aggregates/EndingRegistryAggregate";

export interface IEndingRegistryRepository {
    save(registry: EndingRegistryAggregate): Promise<void>;
    getByStoryId(storyId: StoryId): Promise<EndingRegistryAggregate | null>;
    delete(registryId: string): Promise<void>;
}
