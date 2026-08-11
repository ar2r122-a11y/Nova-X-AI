import { IQuery } from "@nova-x-ai/core";
import { IGetStoryQuery } from "../../Contracts/IStoryEngine";

export class GetStoryQuery implements IQuery, IGetStoryQuery {
    constructor(
        public readonly storyId: string,
        public readonly requesterId: string
    ) {}
}
