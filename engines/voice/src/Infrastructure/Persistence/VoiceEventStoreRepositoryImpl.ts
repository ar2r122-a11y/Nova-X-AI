import type { IStorageEngine } from "@nova-x-ai/storage";
import type { IVoiceEventStoreRepository } from "../../Domain/Repositories/IVoiceEventStoreRepository";

export class VoiceEventStoreRepositoryImpl implements IVoiceEventStoreRepository {
    readonly eventStore;

    constructor(storageEngine: IStorageEngine) {
        this.eventStore = storageEngine.getEventStore();
    }

    async appendToStream(streamId: string, events: unknown[], expectedVersion: number): Promise<void> {
        await this.eventStore.appendToStream(streamId, events as any, expectedVersion);
    }

    async readStream(streamId: string, fromVersion: number): Promise<unknown[]> {
        return this.eventStore.readStream(streamId, fromVersion);
    }

    async getStreamVersion(streamId: string): Promise<number> {
        return this.eventStore.getStreamVersion(streamId);
    }
}
