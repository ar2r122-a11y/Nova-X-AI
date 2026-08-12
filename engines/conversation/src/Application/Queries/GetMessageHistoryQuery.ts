import { IQuery } from "@nova-x-ai/core";

export class GetMessageHistoryQuery implements IQuery {
    constructor(
        public readonly conversationId: string,
        public readonly requesterId: string,
        public readonly limit: number = 50,
        public readonly offset: number = 0
    ) {}
}
