import { GetAvailableBranchesQuery } from "../Queries/GetAvailableBranchesQuery";
import { BranchDto } from "../DTO/BranchDto";
import { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import { IBranchingService } from "../../Domain/Services/IBranchingService";
import { StoryId } from "../../Domain/ValueObjects/StoryId";
import { SceneId } from "../../Domain/ValueObjects/SceneId";

export class GetAvailableBranchesQueryHandler {
    constructor(
        private readonly storyRepository: IStoryRepository,
        private readonly branchingService: IBranchingService
    ) {}

    async handle(query: GetAvailableBranchesQuery): Promise<BranchDto[]> {
        const storyId = StoryId.create(query.storyId);
        const aggregate = await this.storyRepository.getById(storyId);
        if (!aggregate) {
            return [];
        }
        const sceneId = SceneId.create(query.sceneId);
        const branches = this.branchingService.getAvailableBranches(aggregate, sceneId, query.context);
        return branches.map((b) => BranchDto.fromEntity(b));
    }
}
