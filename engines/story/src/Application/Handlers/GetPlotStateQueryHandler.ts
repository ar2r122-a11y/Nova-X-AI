import { GetPlotStateQuery } from "../Queries/GetPlotStateQuery";
import { PlotStateDto } from "../DTO/PlotStateDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { StoryId } from "../../Domain/ValueObjects/StoryId";

export class GetPlotStateQueryHandler {
    constructor(private readonly storyRepository: IStoryRepository) {}

    async handle(query: GetPlotStateQuery): Promise<PlotStateDto | null> {
        const storyId = StoryId.create(query.storyId);
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            return null;
        }

        const progress = aggregate.getProgress();
        const flags: Record<string, unknown> = {};
        aggregate.getFlags().forEach((value, key) => {
            flags[key] = value;
        });

        return new PlotStateDto(
            aggregate.getStoryId().getValue(),
            progress.getCurrentSceneId(),
            Array.from(progress.getCompletedScenes()),
            flags
        );
    }
}
