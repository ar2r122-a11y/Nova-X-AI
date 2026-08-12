export class ConversationSummaryDto {
    constructor(
        public readonly conversationId: string,
        public readonly sessionId: string,
        public readonly summary: string,
        public readonly messageCount: number,
        public readonly turnCount: number,
        public readonly createdAt: number
    ) {}
}
