import type { IEventBus } from "@nova-x-ai/core";
import { ForgetMemoryCommand } from "../Commands/ForgetMemoryCommand";
import { MemoryForgottenEvent } from "../../Domain/Events";
import { MemoryAuthorizationPolicy } from "../../Domain/Policies";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class ForgetMemoryCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: IMemoryRepository
    ) {}

    async handle(command: ForgetMemoryCommand): Promise<void> {
        if (!MemoryAuthorizationPolicy.canStore(command.ownerId, command.ownerId, command.claims.roles)) {
            throw new Error("Unauthorized: user is not authorized to forget memories.");
        }

        const memory = await this.repository.getById(command.memoryId);
        if (!memory) {
            throw new Error(`Memory not found: ${command.memoryId}`);
        }

        memory.forget();
        await this.repository.save(memory);

        const correlationId = `mem-forget-${Date.now()}`;
        await this.eventBus.publish(
            new MemoryForgottenEvent(memory.getId(), command.ownerId, Date.now(), correlationId)
        );
    }
}
