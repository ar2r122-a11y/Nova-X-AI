import { ICommand } from "@nova-x-ai/core";

export class InterruptCommand implements ICommand {
    constructor(
        public readonly conversationId: string,
        public readonly sessionId: string,
        public readonly interruptionType: string,
        public readonly requesterId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
