import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { UpdateAgeControlCommand } from "../Commands";

export class UpdateAgeControlHandler implements ICommandHandler<UpdateAgeControlCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: UpdateAgeControlCommand): Promise<void> {
        const existing = this.security.getAgeControl(command.controlId);
        if (!existing) {
            throw new Error(`Age control not found: ${command.controlId}`);
        }

        const updated = {
            ...existing,
            ageRating: command.ageRating ?? existing.ageRating,
            blockedContentTypes: command.blockedContentTypes ?? existing.blockedContentTypes,
            allowedContentTypes: command.allowedContentTypes ?? existing.allowedContentTypes,
            requiresParentalConsent: command.requiresParentalConsent ?? existing.requiresParentalConsent,
            updatedAt: Date.now()
        };

        this.security.addAgeControl(updated as any);
    }
}
