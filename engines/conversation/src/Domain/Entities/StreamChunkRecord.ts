/**
 * Nova X AI
 * Conversation Engine
 * Domain Entity: StreamChunkRecord
 */

import { StreamChunkSequence } from "../ValueObjects/StreamChunkSequence";

export class StreamChunkRecord {
    private constructor(
        private readonly sequence: StreamChunkSequence,
        private readonly content: string,
        private readonly isLast: boolean,
        private readonly receivedAt: number,
        private readonly isReordered: boolean
    ) {}

    public static create(
        sequence: StreamChunkSequence,
        content: string,
        isLast: boolean,
        isReordered: boolean = false
    ): StreamChunkRecord {
        return new StreamChunkRecord(sequence, content, isLast, Date.now(), isReordered);
    }

    public getSequence(): StreamChunkSequence {
        return this.sequence;
    }

    public getContent(): string {
        return this.content;
    }

    public getIsLast(): boolean {
        return this.isLast;
    }

    public getReceivedAt(): number {
        return this.receivedAt;
    }

    public getIsReordered(): boolean {
        return this.isReordered;
    }
}
