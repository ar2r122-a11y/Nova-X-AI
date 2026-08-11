import { Branch } from "../../Domain/Entities/Branch";

export class BranchDto {
    branchId: string;
    storyId: string;
    sourceSceneId: string;
    targetSceneId: string;
    condition: string;
    priority: string;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;

    constructor(
        branchId: string,
        storyId: string,
        sourceSceneId: string,
        targetSceneId: string,
        condition: string,
        priority: string,
        isActive: boolean,
        createdAt: number,
        updatedAt: number
    ) {
        this.branchId = branchId;
        this.storyId = storyId;
        this.sourceSceneId = sourceSceneId;
        this.targetSceneId = targetSceneId;
        this.condition = condition;
        this.priority = priority;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromEntity(branch: Branch): BranchDto {
        return new BranchDto(
            branch.getBranchId().getValue(),
            branch.getStoryId().getValue(),
            branch.getSourceSceneId().getValue(),
            branch.getTargetSceneId().getValue(),
            branch.getCondition().getValue(),
            branch.getPriority().getValue(),
            branch.isActive(),
            branch.getCreatedAt(),
            branch.getUpdatedAt()
        );
    }
}
