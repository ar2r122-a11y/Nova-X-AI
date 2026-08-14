import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { CheckProviderCompatibilityCommand } from "../Commands";

export class CheckProviderCompatibilityHandler implements ICommandHandler<CheckProviderCompatibilityCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: CheckProviderCompatibilityCommand): Promise<void> {
        const policies = this.security.getAllProviderPolicies();
        const providerPolicy = policies.find(p => p.providerId === command.providerId);

        if (!providerPolicy) {
            throw new Error(`Provider policy not found: ${command.providerId}`);
        }

        const blocked = providerPolicy.blockedContentCategories.includes(command.contentCategory);
        if (blocked) {
            throw new Error(`Content category blocked by provider policy: ${command.contentCategory}`);
        }
    }
}
