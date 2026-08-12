/**
 * Nova X AI
 * Conversation Engine
 * Domain Entity: Message
 */

import { MessageId } from "../ValueObjects/MessageId";
import { MessageRole } from "../ValueObjects/MessageRole";
import { TokenCount } from "../ValueObjects/TokenCount";

export class Message {
    private constructor(
        private readonly id: MessageId,
        private readonly role: MessageRole,
        private readonly content: string,
        private readonly timestamp: number,
        private readonly tokenCount: TokenCount,
        private readonly metadata: Record<string, unknown>,
        private readonly languageHint?: string
    ) {}

    public static create(
        id: MessageId,
        role: MessageRole,
        content: string,
        tokenCount: TokenCount,
        languageHint?: string,
        metadata: Record<string, unknown> = {}
    ): Message {
        return new Message(id, role, content, Date.now(), tokenCount, metadata, languageHint);
    }

    public getId(): MessageId {
        return this.id;
    }

    public getRole(): MessageRole {
        return this.role;
    }

    public getContent(): string {
        return this.content;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }

    public getTokenCount(): TokenCount {
        return this.tokenCount;
    }

    public getMetadata(): Record<string, unknown> {
        return { ...this.metadata };
    }

    public getLanguageHint(): string | undefined {
        return this.languageHint;
    }

    public withContent(content: string, tokenCount: TokenCount): Message {
        return new Message(
            this.id,
            this.role,
            content,
            this.timestamp,
            tokenCount,
            this.metadata,
            this.languageHint
        );
    }
}
