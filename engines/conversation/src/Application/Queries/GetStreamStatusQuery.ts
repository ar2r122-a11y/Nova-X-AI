import { IQuery } from "@nova-x-ai/core";

export class GetStreamStatusQuery implements IQuery {
    constructor(
        public readonly conversationId: string,
        public readonly sessionId: string,
        public readonly requesterId: string
    ) {}
}
