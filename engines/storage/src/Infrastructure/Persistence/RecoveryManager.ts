import { IStorageEngine } from "../../Contracts";

export class RecoveryManager {
    async recover(storage: IStorageEngine): Promise<void> {
        const wal = storage.getWAL();
        const entries = await wal.readEntries(0);
        const eventStore = storage.getEventStore();

        for (const entry of entries) {
            if (entry.operation === "append") {
                const events = entry.data as any[];
                if (events && Array.isArray(events)) {
                    for (const event of events) {
                        await eventStore.appendToStream(event.streamId, [event], event.version - 1);
                    }
                }
            }
        }

        await wal.truncate(entries.length > 0 ? entries[entries.length - 1].timestamp : 0);
    }
}
