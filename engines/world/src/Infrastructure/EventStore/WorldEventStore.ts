import { IEventStore, StorageEvent } from "@nova-x-ai/storage";
import { WorldEventSerialization } from "./WorldEventSerialization";
import { WorldEventUpcaster } from "./WorldEventUpcaster";

export interface WorldEvent {
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

export interface AppendOptions {
    readonly correlationId: string;
    readonly causationId?: string | null;
    readonly metadata?: Record<string, unknown>;
}

export class WorldEventStore {
    private readonly currentSchemaVersion = 1;

    constructor(
        private readonly eventStore: IEventStore,
        private readonly upcaster: WorldEventUpcaster = new WorldEventUpcaster()
    ) {}

    async append(streamId: string, eventType: string, payload: Record<string, unknown>, options: AppendOptions): Promise<void> {
        const expectedVersion = await this.getStreamVersion(streamId);
        const storageEvent = this.createStorageEvent(streamId, eventType, payload, options, expectedVersion + 1);
        await this.eventStore.appendToStream(streamId, [storageEvent], expectedVersion);
    }

    async readStream(streamId: string, fromVersion: number): Promise<WorldEvent[]> {
        const events = await this.eventStore.readStream(streamId, fromVersion);
        return this.upcaster.upcast(events);
    }

    async readAllStreams(fromPosition: number, limit: number): Promise<WorldEvent[]> {
        const events = await this.eventStore.readAllStreams(fromPosition, limit);
        return this.upcaster.upcast(events);
    }

    async getStreamVersion(streamId: string): Promise<number> {
        return this.eventStore.getStreamVersion(streamId);
    }

    async readStreamUpToVersion(streamId: string, upToVersion: number): Promise<WorldEvent[]> {
        const events = await this.eventStore.readStream(streamId, 0);
        return this.upcaster.upcast(events.filter((e: StorageEvent) => e.version <= upToVersion));
    }

    async getStreamEvents(streamId: string): Promise<WorldEvent[]> {
        return this.readStream(streamId, 0);
    }

    subscribe(streamId: string, handler: (event: WorldEvent) => Promise<void>): () => void {
        const unwrapped = async (storageEvent: StorageEvent) => {
            const worldEvents = this.upcaster.upcast([storageEvent]);
            if (worldEvents.length > 0) {
                await handler(worldEvents[0]);
            }
        };
        return this.eventStore.subscribeToStream(streamId, unwrapped);
    }

    private createStorageEvent(streamId: string, eventType: string, payload: Record<string, unknown>, options: AppendOptions, version: number): StorageEvent {
        const data = WorldEventSerialization.serialize({
            streamId,
            version,
            eventType,
            payload,
            timestamp: Date.now(),
            correlationId: options.correlationId,
            causationId: options.causationId ?? null,
            metadata: options.metadata ?? {},
            schemaVersion: this.currentSchemaVersion
        });

        const checksum = WorldEventSerialization.computeChecksum(data);

        return {
            eventId: `${streamId}-${version}`,
            streamId,
            eventType,
            data,
            version,
            timestamp: Date.now(),
            correlationId: options.correlationId,
            checksum
        };
    }
}
