export class MessageAcknowledgementDto {
    constructor(
        public readonly messageId: string,
        public readonly conversationId: string,
        public readonly acknowledgedAt: number,
        public readonly status: string
    ) {}
}
