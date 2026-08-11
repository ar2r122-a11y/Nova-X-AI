import { IDomainEvent } from "@nova-x-ai/core";

export interface ChoiceSelectedEventPayload {
    readonly storyId: string;
    readonly sceneId: string;
    readonly choiceId: string;
    readonly branchId: string;
    readonly selectedFlags: Record<string, unknown>;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;
}

export class ChoiceSelectedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_ChoiceSelected";
    readonly storyId: string;
    readonly sceneId: string;
    readonly choiceId: string;
    readonly branchId: string;
    readonly selectedFlags: Record<string, unknown>;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;

    constructor(
        storyId: string,
        sceneId: string,
        choiceId: string,
        branchId: string,
        selectedFlags: Record<string, unknown>,
        timestamp: number,
        correlationId: string,
        causationId: string | null = null,
        metadata: Record<string, unknown> = {},
        schemaVersion: number = 1
    ) {
        this.storyId = storyId;
        this.sceneId = sceneId;
        this.choiceId = choiceId;
        this.branchId = branchId;
        this.selectedFlags = selectedFlags;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
        this.causationId = causationId;
        this.metadata = metadata;
        this.schemaVersion = schemaVersion;
    }
}
