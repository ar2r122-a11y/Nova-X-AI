import { ICommand } from "@nova-x-ai/core";

export class PostMessageCommand implements ICommand {
    constructor(
        public readonly conversationId: string,
        public readonly sessionId: string,
        public readonly authorId: string,
        public readonly content: string,
        public readonly claims: { roles: string[]; permissions: string[] },
        public readonly role: string,
        public readonly languageHint?: string,
        public readonly metadata: Record<string, unknown> = {}
    ) {}
}
