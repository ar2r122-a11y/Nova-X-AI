import { IQuery } from "@nova-x-ai/core";

export class GetConversationSummaryQuery implements IQuery {
    constructor(
        public readonly conversationId: string,
        public readonly requesterId: string
    ) {}
}
