import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { RotateKeyCommand } from "../Commands";
import { KeyRotatedEvent } from "../../Domain/Events";

export class RotateKeyHandler implements ICommandHandler<RotateKeyCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: RotateKeyCommand): Promise<void> {
        await this.security.rotateKey(command.keyId, command.newKeyId);

        const correlationId = `security-${Date.now()}`;
            await this.security.eventBus.publish(
            new KeyRotatedEvent(command.newKeyId, command.keyId, "AES-GCM", correlationId)
        );
    }
}
