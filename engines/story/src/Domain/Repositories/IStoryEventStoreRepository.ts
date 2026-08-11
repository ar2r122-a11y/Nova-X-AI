import { StoryEvent } from "../Events/StoryEvent";

export interface IStoryEventStoreRepository {
    append(streamId: string, eventType: string, payload: Record<string, unknown>, options: {
        correlationId: string;
        causationId?: string | null;
        metadata?: Record<string, unknown>;
    }): Promise<void>;
    readStream(streamId: string, fromVersion: number): Promise<StoryEvent[]>;
    getStreamVersion(streamId: string): Promise<number>;
    readStreamUpToVersion(streamId: string, upToVersion: number): Promise<StoryEvent[]>;
    getStreamEvents(streamId: string): Promise<StoryEvent[]>;
    subscribe(streamId: string, handler: (event: StoryEvent) => Promise<void>): () => void;
}
