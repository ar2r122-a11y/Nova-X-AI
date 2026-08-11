import { ListStoriesQuery } from "../Queries/ListStoriesQuery";
import { StorySummaryDto } from "../DTO/StorySummaryDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";

export class ListStoriesQueryHandler {
    constructor(private readonly storyRepository: IStoryRepository) {}

    async handle(query: ListStoriesQuery): Promise<StorySummaryDto[]> {
        const aggregates = await this.storyRepository.getAll();
        let filtered = aggregates;
        if (query.status) {
            filtered = aggregates.filter((a) => a.getStatus().getValue() === query.status);
        }
        return filtered.map((a) => StorySummaryDto.fromAggregate(a));
    }
}
