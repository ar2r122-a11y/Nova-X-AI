/**
 * Nova X AI
 * Conversation Engine
 * Domain Entity: ToolResult
 */

import { TokenCount } from "../ValueObjects/TokenCount";

export class ToolResult {
    private constructor(
        private readonly toolCallId: string,
        private readonly content: string,
        private readonly isError: boolean,
        private readonly tokenCount: TokenCount,
        private readonly durationMs: number
    ) {}

    public static success(
        toolCallId: string,
        content: string,
        tokenCount: TokenCount,
        durationMs: number
    ): ToolResult {
        return new ToolResult(toolCallId, content, false, tokenCount, durationMs);
    }

    public static error(
        toolCallId: string,
        content: string,
        tokenCount: TokenCount,
        durationMs: number
    ): ToolResult {
        return new ToolResult(toolCallId, content, true, tokenCount, durationMs);
    }

    public getToolCallId(): string {
        return this.toolCallId;
    }

    public getContent(): string {
        return this.content;
    }

    public isErrorResult(): boolean {
        return this.isError;
    }

    public getTokenCount(): TokenCount {
        return this.tokenCount;
    }

    public getDurationMs(): number {
        return this.durationMs;
    }
}
