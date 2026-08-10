import { describe, it, expect } from "vitest";
import { RelationshipMetricsCalculator } from "../../src/Domain/Calculators/RelationshipMetricsCalculator";
import { RelationshipAggregate } from "../../src/Domain/Aggregates/RelationshipAggregate";
import { BondType } from "../../src/Domain/ValueObjects/BondType";

describe("RelationshipMetricsCalculator", () => {
    const calculator = new RelationshipMetricsCalculator();

    it("test_calculate_trust_delta_positive_valence", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const delta = calculator.calculateTrustDelta(aggregate, "deep_conversation", 0.8);
        expect(delta).toBeGreaterThan(0);
    });

    it("test_calculate_trust_delta_negative_valence", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const delta = calculator.calculateTrustDelta(aggregate, "conflict", -0.8);
        expect(delta).toBeLessThan(0);
    });

    it("test_calculate_affinity_delta", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const delta = calculator.calculateAffinityDelta(aggregate, "shared_experience", 0.5);
        expect(delta).toBeGreaterThan(0);
    });

    it("test_calculate_respect_delta", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const delta = calculator.calculateRespectDelta(aggregate, "deep_conversation", 0.7);
        expect(delta).toBeGreaterThan(0);
    });

    it("test_calculate_loyalty_delta", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const delta = calculator.calculateLoyaltyDelta(aggregate, "shared_experience", 0.6);
        expect(delta).toBeGreaterThan(0);
    });
});
