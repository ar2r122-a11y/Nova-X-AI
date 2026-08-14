import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { CreateAgeControlCommand } from "../Commands";
import { AgeControlViolationEvent } from "../../Domain/Events";

export class CreateAgeControlHandler implements ICommandHandler<CreateAgeControlCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: CreateAgeControlCommand): Promise<void> {
        const control = {
            controlId: command.controlId,
            identityId: command.identityId,
            ageRating: command.ageRating,
            blockedContentTypes: command.blockedContentTypes,
            allowedContentTypes: command.allowedContentTypes,
            requiresParentalConsent: command.requiresParentalConsent,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        await this.security.addAgeControl(control as any);

        const correlationId = `security-${Date.now()}`;
        await this.security.eventBus.publish(
            new AgeControlViolationEvent(
                command.controlId,
                command.identityId,
                command.ageRating,
                command.ageRating,
                correlationId
            )
        );
    }
}
