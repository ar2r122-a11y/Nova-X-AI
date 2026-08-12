import { IQuery } from "@nova-x-ai/core";

export class GetConversationSessionQuery implements IQuery {
    constructor(
        public readonly sessionId: string,
        public readonly requesterId: string
    ) {}
}
