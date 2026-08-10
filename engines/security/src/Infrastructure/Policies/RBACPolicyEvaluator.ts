import type { IPolicyEvaluator } from "../../Contracts";
import type { PermissionResultDto } from "../../Application/DTO";
import { SecurityPolicy } from "../../Domain/Entities";

export class RBACPolicyEvaluator implements IPolicyEvaluator {
    private policies: SecurityPolicy[] = [];

    addPolicy(policy: SecurityPolicy): void {
        this.policies.push(policy);
        this.policies.sort((a, b) => b.priority - a.priority);
    }

    setPolicies(policies: SecurityPolicy[]): void {
        this.policies = [...policies].sort((a, b) => b.priority - a.priority);
    }

    evaluate(identityId: string, resource: string, action: string, claims?: Record<string, unknown>): PermissionResultDto {
        const identityRoles = (claims?.roles as string[]) ?? [];

        for (const policy of this.policies) {
            if (policy.resource !== resource && policy.resource !== "*") continue;
            if (policy.action !== action && policy.action !== "*") continue;

            const roleMatch = identityRoles.some(role => role === policy.conditions.role || policy.conditions.role === "*");
            if (!roleMatch) continue;

            if (policy.effect === "allow") {
                return { allowed: true, matchedPolicy: policy.policyId };
            } else {
                return { allowed: false, reason: "denied_by_policy", matchedPolicy: policy.policyId };
            }
        }

        return { allowed: false, reason: "no_matching_policy" };
    }
}
