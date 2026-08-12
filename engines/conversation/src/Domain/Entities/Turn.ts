/**
 * Nova X AI
 * Conversation Engine
 * Domain Entity: Turn
 */

import { MessageId } from "../ValueObjects/MessageId";
import { TokenCount } from "../ValueObjects/TokenCount";

export class Turn {
    private constructor(
        private readonly turnId: string,
        private readonly sequenceNumber: number,
        private readonly userMessageId: MessageId,
        private readonly startedAt: number,
        private readonly assistantMessageId?: MessageId,
        private readonly toolCalls: string[] = [],
        private readonly tokenCount: TokenCount = TokenCount.zero(),
        private readonly completedAt?: number
    ) {}

    public static create(
        turnId: string,
        sequenceNumber: number,
        userMessageId: MessageId,
        startedAt: number,
        tokenCount: TokenCount = TokenCount.zero()
    ): Turn {
        return new Turn(
            turnId,
            sequenceNumber,
            userMessageId,
            startedAt,
            undefined,
            [],
            tokenCount,
            undefined
        );
    }

    public getTurnId(): string {
        return this.turnId;
    }

    public getSequenceNumber(): number {
        return this.sequenceNumber;
    }

    public getUserMessageId(): MessageId {
        return this.userMessageId;
    }

    public getAssistantMessageId(): MessageId | undefined {
        return this.assistantMessageId;
    }

    public getToolCalls(): readonly string[] {
        return this.toolCalls;
    }

    public getTokenCount(): TokenCount {
        return this.tokenCount;
    }

    public getStartedAt(): number {
        return this.startedAt;
    }

    public getCompletedAt(): number | undefined {
        return this.completedAt;
    }

    public isCompleted(): boolean {
        return this.completedAt !== undefined;
    }

    public withAssistantMessage(assistantMessageId: MessageId): Turn {
        return new Turn(
            this.turnId,
            this.sequenceNumber,
            this.userMessageId,
            this.startedAt,
            assistantMessageId,
            this.toolCalls,
            this.tokenCount,
            Date.now()
        );
    }

    public addToolCall(toolCallId: string): Turn {
        return new Turn(
            this.turnId,
            this.sequenceNumber,
            this.userMessageId,
            this.startedAt,
            this.assistantMessageId,
            [...this.toolCalls, toolCallId],
            this.tokenCount,
            this.completedAt
        );
    }
}
