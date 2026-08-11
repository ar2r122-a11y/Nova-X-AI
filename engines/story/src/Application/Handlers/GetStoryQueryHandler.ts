import { GetStoryQuery } from "../Queries/GetStoryQuery";
import { StoryAggregateDto } from "../DTO/StoryAggregateDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { StoryId } from "../../Domain/ValueObjects/StoryId";

export class GetStoryQueryHandler {
    constructor(private readonly storyRepository: IStoryRepository) {}

    async handle(query: GetStoryQuery): Promise<StoryAggregateDto | null> {
        const storyId = StoryId.create(query.storyId);
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            return null;
        }
        return StoryAggregateDto.fromAggregate(aggregate);
    }
}
