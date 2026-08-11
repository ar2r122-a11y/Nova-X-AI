import { IQuery } from "@nova-x-ai/core";
import { IListStoriesQuery } from "../../Contracts/IStoryEngine";

export class ListStoriesQuery implements IQuery, IListStoriesQuery {
    constructor(
        public readonly requesterId: string,
        public readonly status?: string
    ) {}
}
