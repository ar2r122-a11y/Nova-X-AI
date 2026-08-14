import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { RegisterProviderPolicyCommand } from "../Commands";
import { ProviderPolicyIncompatibleEvent } from "../../Domain/Events";

export class RegisterProviderPolicyHandler implements ICommandHandler<RegisterProviderPolicyCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: RegisterProviderPolicyCommand): Promise<void> {
        const policy = {
            policyId: command.policyId,
            providerId: command.providerId,
            providerName: command.providerName,
            allowedContentCategories: command.allowedContentCategories,
            blockedContentCategories: command.blockedContentCategories,
            safetySettings: command.safetySettings,
            compatible: command.compatible,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        await this.security.addProviderPolicy(policy as any);

        const correlationId = `security-${Date.now()}`;
        if (!command.compatible) {
            await this.security.eventBus.publish(
                new ProviderPolicyIncompatibleEvent(
                    command.policyId,
                    command.providerId,
                    "Policy marked as incompatible",
                    correlationId
                )
            );
        }
    }
}
