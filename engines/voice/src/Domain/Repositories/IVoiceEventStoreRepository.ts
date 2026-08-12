import type { IEventStore } from "@nova-x-ai/storage";

export interface IVoiceEventStoreRepository {
    readonly eventStore: IEventStore;
    appendToStream(streamId: string, events: unknown[], expectedVersion: number): Promise<void>;
    readStream(streamId: string, fromVersion: number): Promise<unknown[]>;
    getStreamVersion(streamId: string): Promise<number>;
}
