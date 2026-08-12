/**
 * Nova X AI
 * Conversation Engine
 * Domain Entity: ToolCall
 */

import { MessageId } from "../ValueObjects/MessageId";
import { ToolCallStatus } from "../ValueObjects/ToolCallStatus";

export class ToolCall {
    private constructor(
        private readonly toolCallId: string,
        private readonly parentMessageId: MessageId,
        private readonly toolName: string,
        private readonly startedAt: number,
        private readonly status: ToolCallStatus,
        private readonly result?: unknown,
        private readonly error?: string,
        private readonly completedAt?: number,
        private readonly args: Record<string, unknown> = {}
    ) {}

    public static create(
        toolCallId: string,
        parentMessageId: MessageId,
        toolName: string,
        args: Record<string, unknown>
    ): ToolCall {
        return new ToolCall(
            toolCallId,
            parentMessageId,
            toolName,
            Date.now(),
            ToolCallStatus.pending(),
            undefined,
            undefined,
            undefined,
            args
        );
    }

    public getToolCallId(): string {
        return this.toolCallId;
    }

    public getParentMessageId(): MessageId {
        return this.parentMessageId;
    }

    public getToolName(): string {
        return this.toolName;
    }

    public getArguments(): Record<string, unknown> {
        return { ...this.args };
    }

    public getStatus(): ToolCallStatus {
        return this.status;
    }

    public getResult(): unknown {
        return this.result;
    }

    public getError(): string | undefined {
        return this.error;
    }

    public getStartedAt(): number {
        return this.startedAt;
    }

    public getCompletedAt(): number | undefined {
        return this.completedAt;
    }

    public markExecuting(): ToolCall {
        return new ToolCall(
            this.toolCallId,
            this.parentMessageId,
            this.toolName,
            this.startedAt,
            ToolCallStatus.executing(),
            this.result,
            this.error,
            this.completedAt,
            this.args
        );
    }

    public markCompleted(result: unknown): ToolCall {
        return new ToolCall(
            this.toolCallId,
            this.parentMessageId,
            this.toolName,
            this.startedAt,
            ToolCallStatus.completed(),
            result,
            this.error,
            Date.now(),
            this.args
        );
    }

    public markFailed(error: string): ToolCall {
        return new ToolCall(
            this.toolCallId,
            this.parentMessageId,
            this.toolName,
            this.startedAt,
            ToolCallStatus.failed(),
            this.result,
            error,
            Date.now(),
            this.args
        );
    }

    public markAborted(): ToolCall {
        return new ToolCall(
            this.toolCallId,
            this.parentMessageId,
            this.toolName,
            this.startedAt,
            ToolCallStatus.aborted(),
            this.result,
            this.error,
            Date.now(),
            this.args
        );
    }
}
