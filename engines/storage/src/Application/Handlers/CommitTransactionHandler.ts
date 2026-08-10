import type { ICommandHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { CommitTransactionCommand } from "../Commands";

export class CommitTransactionHandler implements ICommandHandler<CommitTransactionCommand> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(command: CommitTransactionCommand): Promise<void> {
        const unitOfWork = this.storage.getUnitOfWork();
        const eventStore = this.storage.getEventStore();
        let expectedVersion = command.expectedVersion;

        for (const event of command.events) {
            await eventStore.appendToStream(command.streamId, [event as any], expectedVersion);
            expectedVersion++;
        }

        await unitOfWork.commit();

        const { StorageTransactionCommittedEvent } = await import("../../Domain/Events");
        await this.storage.eventBus.publish(
            new StorageTransactionCommittedEvent(
                unitOfWork.transactionId,
                command.streamId,
                command.events.length,
                `storage-${Date.now()}`
            )
        );
    }
}
