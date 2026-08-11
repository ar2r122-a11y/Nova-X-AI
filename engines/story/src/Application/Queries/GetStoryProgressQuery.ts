import { IQuery } from "@nova-x-ai/core";
import { IGetStoryProgressQuery } from "../../Contracts/IStoryEngine";

export class GetStoryProgressQuery implements IQuery, IGetStoryProgressQuery {
    constructor(
        public readonly storyId: string,
        public readonly requesterId: string
    ) {}
}
