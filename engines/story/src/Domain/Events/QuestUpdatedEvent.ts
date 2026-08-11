import { IDomainEvent } from "@nova-x-ai/core";

export interface QuestUpdatedEventPayload {
    readonly storyId: string;
    readonly questId: string;
    readonly status: string;
    readonly progress: number;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;
}

export class QuestUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_QuestUpdated";
    readonly storyId: string;
    readonly questId: string;
    readonly status: string;
    readonly progress: number;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;

    constructor(
        storyId: string,
        questId: string,
        status: string,
        progress: number,
        timestamp: number,
        correlationId: string,
        causationId: string | null = null,
        metadata: Record<string, unknown> = {},
        schemaVersion: number = 1
    ) {
        this.storyId = storyId;
        this.questId = questId;
        this.status = status;
        this.progress = progress;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
        this.causationId = causationId;
        this.metadata = metadata;
        this.schemaVersion = schemaVersion;
    }
}
