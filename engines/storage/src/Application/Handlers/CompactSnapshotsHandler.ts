import type { ICommandHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { CompactSnapshotsCommand } from "../Commands";

export class CompactSnapshotsHandler implements ICommandHandler<CompactSnapshotsCommand> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(command: CompactSnapshotsCommand): Promise<void> {
        const snapshotStore = this.storage.getSnapshotStore();
        let compacted = 0;

        if (command.streamId) {
            const count = await snapshotStore.compact(command.streamId, command.maxAgeMs);
            compacted += count;
        } else {
            const snapshots = await snapshotStore.getAllSnapshots();
            for (const snapshot of snapshots) {
                const count = await snapshotStore.compact(snapshot.streamId, command.maxAgeMs);
                compacted += count;
            }
        }

        if (compacted > 0) {
            const { StorageSnapshotTakenEvent } = await import("../../Domain/Events");
            await this.storage.eventBus.publish(
                new StorageSnapshotTakenEvent(
                    `compact-${Date.now()}`,
                    command.streamId ?? "all",
                    Date.now(),
                    `storage-${Date.now()}`
                )
            );
        }
    }
}
