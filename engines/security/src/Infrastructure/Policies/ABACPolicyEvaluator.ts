import type { IPolicyEvaluator } from "../../Contracts";
import type { PermissionResultDto } from "../../Application/DTO";
import { SecurityPolicy } from "../../Domain/Entities";

export class ABACPolicyEvaluator implements IPolicyEvaluator {
    private policies: SecurityPolicy[] = [];

    addPolicy(policy: SecurityPolicy): void {
        this.policies.push(policy);
        this.policies.sort((a, b) => b.priority - a.priority);
    }

    setPolicies(policies: SecurityPolicy[]): void {
        this.policies = [...policies].sort((a, b) => b.priority - a.priority);
    }

    evaluate(identityId: string, resource: string, action: string, claims?: Record<string, unknown>): PermissionResultDto {
        for (const policy of this.policies) {
            if (policy.resource !== resource && policy.resource !== "*") continue;
            if (policy.action !== action && policy.action !== "*") continue;

            const matches = this.evaluateConditions(policy.conditions, identityId, claims);
            if (!matches) continue;

            if (policy.effect === "allow") {
                return { allowed: true, matchedPolicy: policy.policyId };
            } else {
                return { allowed: false, reason: "denied_by_policy", matchedPolicy: policy.policyId };
            }
        }

        return { allowed: false, reason: "no_matching_policy" };
    }

    private evaluateConditions(conditions: Record<string, unknown>, identityId: string, claims?: Record<string, unknown>): boolean {
        for (const [key, value] of Object.entries(conditions)) {
            if (key === "role") {
                const roles = (claims?.roles as string[]) ?? [];
                if (value === "*") continue;
                if (!roles.includes(value as string)) return false;
            } else if (key === "identityId") {
                if (value === "*") continue;
                if (identityId !== (value as string)) return false;
            } else if (key === "clearanceLevel") {
                const clearance = (claims?.clearanceLevel as number) ?? 0;
                if ((value as number) > clearance) return false;
            }
        }
        return true;
    }
}
