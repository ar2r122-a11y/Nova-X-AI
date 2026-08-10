import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { RevokeTokenCommand } from "../Commands";
import { TokenRevokedEvent } from "../../Domain/Events";

export class RevokeTokenHandler implements ICommandHandler<RevokeTokenCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: RevokeTokenCommand): Promise<void> {
        await this.security.revokeToken(command.tokenId, command.reason);

        const correlationId = `security-${Date.now()}`;
            await this.security.eventBus.publish(
            new TokenRevokedEvent(command.tokenId, command.tokenId, command.reason, correlationId)
        );
    }
}
