import { IDomainEvent } from "@nova-x-ai/core";

export interface StoryCompletedEventPayload {
    readonly storyId: string;
    readonly endingId: string;
    readonly finalFlags: Record<string, unknown>;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;
}

export class StoryCompletedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_StoryCompleted";
    readonly storyId: string;
    readonly endingId: string;
    readonly finalFlags: Record<string, unknown>;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;

    constructor(
        storyId: string,
        endingId: string,
        finalFlags: Record<string, unknown>,
        timestamp: number,
        correlationId: string,
        causationId: string | null = null,
        metadata: Record<string, unknown> = {},
        schemaVersion: number = 1
    ) {
        this.storyId = storyId;
        this.endingId = endingId;
        this.finalFlags = finalFlags;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
        this.causationId = causationId;
        this.metadata = metadata;
        this.schemaVersion = schemaVersion;
    }
}
