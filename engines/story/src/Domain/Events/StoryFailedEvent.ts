import { IDomainEvent } from "@nova-x-ai/core";

export interface StoryFailedEventPayload {
    readonly storyId: string;
    readonly reason: string;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;
}

export class StoryFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_StoryFailed";
    readonly storyId: string;
    readonly reason: string;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;

    constructor(
        storyId: string,
        reason: string,
        timestamp: number,
        correlationId: string,
        causationId: string | null = null,
        metadata: Record<string, unknown> = {},
        schemaVersion: number = 1
    ) {
        this.storyId = storyId;
        this.reason = reason;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
        this.causationId = causationId;
        this.metadata = metadata;
        this.schemaVersion = schemaVersion;
    }
}
