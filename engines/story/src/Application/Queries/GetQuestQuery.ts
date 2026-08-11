import { IQuery } from "@nova-x-ai/core";
import { IGetQuestQuery } from "../../Contracts/IStoryEngine";

export class GetQuestQuery implements IQuery, IGetQuestQuery {
    constructor(
        public readonly storyId: string,
        public readonly questId: string,
        public readonly requesterId: string
    ) {}
}
