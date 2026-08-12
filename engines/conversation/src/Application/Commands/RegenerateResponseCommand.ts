import { ICommand } from "@nova-x-ai/core";

export class RegenerateResponseCommand implements ICommand {
    constructor(
        public readonly conversationId: string,
        public readonly sessionId: string,
        public readonly requesterId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
