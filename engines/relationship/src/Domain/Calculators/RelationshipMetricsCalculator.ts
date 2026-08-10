import type { RelationshipAggregate } from "../Aggregates/RelationshipAggregate";

export interface IRelationshipCalculator {
    calculateTrustDelta(
        aggregate: RelationshipAggregate,
        interactionType: string,
        emotionalValence: number
    ): number;
    calculateAffinityDelta(
        aggregate: RelationshipAggregate,
        interactionType: string,
        emotionalValence: number
    ): number;
    calculateRespectDelta(
        aggregate: RelationshipAggregate,
        interactionType: string,
        emotionalValence: number
    ): number;
    calculateLoyaltyDelta(
        aggregate: RelationshipAggregate,
        interactionType: string,
        emotionalValence: number
    ): number;
}

export class RelationshipMetricsCalculator implements IRelationshipCalculator {
    calculateTrustDelta(
        _aggregate: RelationshipAggregate,
        interactionType: string,
        emotionalValence: number
    ): number {
        const baseTrustImpact = 0.05;
        const interactionMultiplier = this.getInteractionMultiplier(interactionType);
        const valenceImpact = emotionalValence * baseTrustImpact * interactionMultiplier;
        return Math.max(-1.0, Math.min(1.0, valenceImpact));
    }

    calculateAffinityDelta(
        _aggregate: RelationshipAggregate,
        interactionType: string,
        emotionalValence: number
    ): number {
        const baseAffinityImpact = 0.05;
        const interactionMultiplier = this.getInteractionMultiplier(interactionType);
        const valenceImpact = emotionalValence * baseAffinityImpact * interactionMultiplier;
        return Math.max(-1.0, Math.min(1.0, valenceImpact));
    }

    calculateRespectDelta(
        _aggregate: RelationshipAggregate,
        interactionType: string,
        emotionalValence: number
    ): number {
        const baseRespectImpact = 0.03;
        const interactionMultiplier = this.getInteractionMultiplier(interactionType);
        const valenceImpact = emotionalValence * baseRespectImpact * interactionMultiplier;
        return Math.max(-1.0, Math.min(1.0, valenceImpact));
    }

    calculateLoyaltyDelta(
        _aggregate: RelationshipAggregate,
        interactionType: string,
        emotionalValence: number
    ): number {
        const baseLoyaltyImpact = 0.02;
        const interactionMultiplier = this.getInteractionMultiplier(interactionType);
        const valenceImpact = emotionalValence * baseLoyaltyImpact * interactionMultiplier;
        return Math.max(-1.0, Math.min(1.0, valenceImpact));
    }

    private getInteractionMultiplier(interactionType: string): number {
        switch (interactionType) {
            case "deep_conversation":
                return 2.0;
            case "shared_experience":
                return 1.5;
            case "conflict":
                return 1.5;
            case "betrayal":
                return 3.0;
            case "casual":
                return 0.5;
            default:
                return 1.0;
        }
    }
}
