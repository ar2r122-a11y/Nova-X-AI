import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { ValidatePermissionsCommand } from "../Commands";
import { AccessDeniedEvent } from "../../Domain/Events";

export class ValidatePermissionsHandler implements ICommandHandler<ValidatePermissionsCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: ValidatePermissionsCommand): Promise<void> {
        const result = await this.security.validatePermissions(
            command.identityId,
            command.resource,
            command.action,
            command.claims
        );

        if (!result.allowed) {
            const correlationId = `security-${Date.now()}`;
            await this.security.eventBus.publish(
                new AccessDeniedEvent(
                    command.identityId,
                    command.resource,
                    command.action,
                    result.reason ?? "permission_denied",
                    correlationId
                )
            );
        }
    }
}
