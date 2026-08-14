import type { IProviderPolicyCompatibilityChecker } from "../../Contracts";
import type { ProviderPolicy } from "../../Domain/Entities";

export class ProviderPolicyCompatibilityChecker implements IProviderPolicyCompatibilityChecker {
    checkCompatibility(policy: ProviderPolicy, contentCategory: string): { compatible: boolean; reason?: string } {
        if (!policy.compatible) {
            return {
                compatible: false,
                reason: `Provider "${policy.providerName}" is marked as incompatible`
            };
        }

        if (policy.blockedContentCategories.includes(contentCategory)) {
            return {
                compatible: false,
                reason: `Content category "${contentCategory}" is blocked by provider "${policy.providerName}"`
            };
        }

        if (policy.allowedContentCategories.length > 0 && !policy.allowedContentCategories.includes(contentCategory) && !policy.allowedContentCategories.includes("*")) {
            return {
                compatible: false,
                reason: `Content category "${contentCategory}" is not allowed by provider "${policy.providerName}"`
            };
        }

        return { compatible: true };
    }
}
