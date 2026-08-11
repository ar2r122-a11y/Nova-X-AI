import { IQuery } from "@nova-x-ai/core";
import { IGetAvailableBranchesQuery } from "../../Contracts/IStoryEngine";

export class GetAvailableBranchesQuery implements IQuery, IGetAvailableBranchesQuery {
    constructor(
        public readonly storyId: string,
        public readonly sceneId: string,
        public readonly context: Record<string, unknown>,
        public readonly requesterId: string
    ) {}
}
