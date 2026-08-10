import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { LockoutIdentityCommand } from "../Commands";
import { LockoutEvent } from "../../Domain/Events";

export class LockoutIdentityHandler implements ICommandHandler<LockoutIdentityCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: LockoutIdentityCommand): Promise<void> {
        await this.security.lockoutIdentity(command.identityId, command.reason);

        const correlationId = `security-${Date.now()}`;
            await this.security.eventBus.publish(
            new LockoutEvent(command.identityId, command.reason, 0, correlationId)
        );
    }
}
