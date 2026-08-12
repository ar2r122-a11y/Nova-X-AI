import { ICommand } from "@nova-x-ai/core";

export class ScheduleConversationCommand implements ICommand {
    constructor(
        public readonly conversationId: string,
        public readonly sessionId: string,
        public readonly scheduledAt: number,
        public readonly prompt: string,
        public readonly ownerId: string,
        public readonly claims: { roles: string[]; permissions: string[] }
    ) {}
}
