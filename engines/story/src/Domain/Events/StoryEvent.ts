export interface StoryEvent {
    readonly streamId: string;
    readonly version: number;
    readonly eventType: string;
    readonly payload: Record<string, unknown>;
    readonly timestamp: number;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly metadata: Record<string, unknown>;
    readonly schemaVersion: number;
}
