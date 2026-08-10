import type { RelationshipAggregate } from "../Aggregates/RelationshipAggregate";
import { BondType } from "../ValueObjects/BondType";

export class TrustBoundaryEnforcementPolicy {
    static canProgressRomance(aggregate: RelationshipAggregate): boolean {
        if (aggregate.getBondType() !== BondType.Romance) {
            return false;
        }

        const metrics = aggregate.getMetrics();
        const requiredTrust = 0.6;

        switch (aggregate.getRelationshipStatus()) {
            case "establishing":
                return metrics.trust >= 0.3;
            case "active":
            case "strained":
                return metrics.trust >= requiredTrust;
            case "dormant":
            case "severed":
            default:
                return false;
        }
    }

    static canProgressIntimacy(aggregate: RelationshipAggregate, requiredTrustThreshold: number = 0.7): boolean {
        const metrics = aggregate.getMetrics();
        return metrics.trust >= requiredTrustThreshold;
    }

    static getMaximumAllowedIntimacyLevel(aggregate: RelationshipAggregate): string {
        const metrics = aggregate.getMetrics();

        if (metrics.trust >= 0.8) {
            return "partnered";
        } else if (metrics.trust >= 0.6) {
            return "committed";
        } else if (metrics.trust >= 0.4) {
            return "dating";
        } else if (metrics.trust >= 0.2) {
            return "crushing";
        }

        return "none";
    }
}
