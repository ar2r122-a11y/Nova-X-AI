import { GetStoryProgressQuery } from "../Queries/GetStoryProgressQuery";
import { StoryProgressDto } from "../DTO/StoryProgressDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IProgressionCalculator } from "../../Domain/Services/IProgressionCalculator";
import { StoryId } from "../../Domain/ValueObjects/StoryId";

export class GetStoryProgressQueryHandler {
    constructor(
        private readonly storyRepository: IStoryRepository,
        private readonly progressionCalculator: IProgressionCalculator
    ) {}

    async handle(query: GetStoryProgressQuery): Promise<StoryProgressDto | null> {
        const storyId = StoryId.create(query.storyId);
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            return null;
        }
        const progress = this.progressionCalculator.calculateStoryProgress(aggregate);
        return StoryProgressDto.fromProgress(progress);
    }
}
