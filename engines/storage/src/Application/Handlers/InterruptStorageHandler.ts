import type { ICommandHandler } from "@nova-x-ai/core";
import type { IStorageEngine } from "../../Contracts";
import { InterruptStorageCommand } from "../Commands";

export class InterruptStorageHandler implements ICommandHandler<InterruptStorageCommand> {
    constructor(private readonly storage: IStorageEngine) {}

    async handle(command: InterruptStorageCommand): Promise<void> {
        await this.storage.interrupt();

        const { StorageExecutionFailedEvent } = await import("../../Domain/Events");
        await this.storage.eventBus.publish(
            new StorageExecutionFailedEvent(
                "InterruptStorage",
                command.reason,
                `storage-${Date.now()}`
            )
        );
    }
}
