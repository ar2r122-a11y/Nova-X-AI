export class ConversationSessionDto {
    constructor(
        public conversationId: string,
        public sessionId: string,
        public state: string,
        public participantIds: string[],
        public messageCount: number,
        public turnCount: number,
        public createdAt: number,
        public lastActivityAt: number,
        public summary?: string
    ) {}

    public static fromAggregate(aggregate: {
        getId: () => { getValue: () => string };
        getSessionId: () => { getValue: () => string };
        getState: () => { getValue: () => string };
        getParticipants: () => Array<{ getId: () => { getValue: () => string } }>;
        getMessages: () => readonly any[];
        getTurns: () => readonly any[];
        getCreatedAt: () => number;
        getLastActivityAt: () => number;
        getSummary: () => string | undefined;
    }): ConversationSessionDto {
        const participants = aggregate.getParticipants();
        return new ConversationSessionDto(
            aggregate.getId().getValue(),
            aggregate.getSessionId().getValue(),
            aggregate.getState().getValue(),
            participants.map(p => p.getId().getValue()),
            aggregate.getMessages().length,
            aggregate.getTurns().length,
            aggregate.getCreatedAt(),
            aggregate.getLastActivityAt(),
            aggregate.getSummary()
        );
    }
}
