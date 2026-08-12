import { ICommand } from "@nova-x-ai/core";

export class StartSessionCommand implements ICommand {
    constructor(
        public readonly conversationId: string,
        public readonly ownerId: string,
        public readonly participantIds: string[],
        public readonly claims: { roles: string[]; permissions: string[] },
        public readonly initialPrompt?: string,
        public readonly metadata: Record<string, unknown> = {}
    ) {}
}
