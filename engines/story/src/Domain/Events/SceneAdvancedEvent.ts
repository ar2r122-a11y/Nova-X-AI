import { IDomainEvent } from "@nova-x-ai/core";

export interface SceneAdvancedEventPayload {
    readonly storyId: string;
    readonly sceneId: string;
    readonly previousSceneId: string;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;
}

export class SceneAdvancedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_SceneAdvanced";
    readonly storyId: string;
    readonly sceneId: string;
    readonly previousSceneId: string;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;

    constructor(
        storyId: string,
        sceneId: string,
        previousSceneId: string,
        timestamp: number,
        correlationId: string,
        causationId: string | null = null,
        metadata: Record<string, unknown> = {},
        schemaVersion: number = 1
    ) {
        this.storyId = storyId;
        this.sceneId = sceneId;
        this.previousSceneId = previousSceneId;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
        this.causationId = causationId;
        this.metadata = metadata;
        this.schemaVersion = schemaVersion;
    }
}
