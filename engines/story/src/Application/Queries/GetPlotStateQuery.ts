import { IQuery } from "@nova-x-ai/core";

export class GetPlotStateQuery implements IQuery {
    constructor(
        public readonly storyId: string,
        public readonly requesterId: string
    ) {}
}
