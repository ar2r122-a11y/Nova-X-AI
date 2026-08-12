export class MessageDto {
    constructor(
        public messageId: string,
        public conversationId: string,
        public sessionId: string,
        public authorId: string,
        public tokenCount: number,
        public timestamp: number,
        public role: string,
        public content: string,
        public metadata: Record<string, unknown>,
        public languageHint?: string
    ) {}

    public static fromEntity(entity: {
        getId: () => { getValue: () => string };
        getRole: () => { getValue: () => string };
        getContent: () => string;
        getTimestamp: () => number;
        getTokenCount: () => { getValue: () => number };
        getLanguageHint: () => string | undefined;
        getMetadata: () => Record<string, unknown>;
    }, conversationId: string, sessionId: string, authorId: string): MessageDto {
        return new MessageDto(
            entity.getId().getValue(),
            conversationId,
            sessionId,
            authorId,
            entity.getTokenCount().getValue(),
            entity.getTimestamp(),
            entity.getRole().getValue(),
            entity.getContent(),
            entity.getMetadata(),
            entity.getLanguageHint()
        );
    }
}
