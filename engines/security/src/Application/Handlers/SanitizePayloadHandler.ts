import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { SanitizePayloadCommand } from "../Commands";
import { PayloadSanitizedEvent } from "../../Domain/Events";

export class SanitizePayloadHandler implements ICommandHandler<SanitizePayloadCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: SanitizePayloadCommand): Promise<void> {
        const threatsRemoved = await this.security.sanitizePayload(command.payload, command.resource);

        const correlationId = `security-${Date.now()}`;
            await this.security.eventBus.publish(
            new PayloadSanitizedEvent(command.resource, threatsRemoved, Date.now(), correlationId)
        );
    }
}
