import { ICommand } from "@nova-x-ai/core";

export class UpdateConversationStateCommand implements ICommand {
    constructor(
        public readonly conversationId: string,
        public readonly state: string,
        public readonly requesterId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
