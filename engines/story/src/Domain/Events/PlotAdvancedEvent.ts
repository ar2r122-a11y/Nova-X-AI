import { IDomainEvent } from "@nova-x-ai/core";

export interface PlotAdvancedEventPayload {
    readonly storyId: string;
    readonly plotPointId: string;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;
}

export class PlotAdvancedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_PlotAdvanced";
    readonly storyId: string;
    readonly plotPointId: string;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;

    constructor(
        storyId: string,
        plotPointId: string,
        timestamp: number,
        correlationId: string,
        causationId: string | null = null,
        metadata: Record<string, unknown> = {},
        schemaVersion: number = 1
    ) {
        this.storyId = storyId;
        this.plotPointId = plotPointId;
        this.timestamp = timestamp;
        this.correlationId = correlationId;
        this.causationId = causationId;
        this.metadata = metadata;
        this.schemaVersion = schemaVersion;
    }
}
