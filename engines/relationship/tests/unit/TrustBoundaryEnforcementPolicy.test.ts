import { describe, it, expect } from "vitest";
import { TrustBoundaryEnforcementPolicy } from "../../src/Domain/Policies/TrustBoundaryEnforcementPolicy";
import { RelationshipAggregate } from "../../src/Domain/Aggregates/RelationshipAggregate";
import { BondType } from "../../src/Domain/ValueObjects/BondType";

describe("TrustBoundaryEnforcementPolicy", () => {
    it("test_romance_progression_blocked_when_trust_below_threshold", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Romance);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: [],
            sharedMemoryIds: [],
            trustDelta: -0.4,
            affinityDelta: -0.2,
            respectDelta: -0.2,
            loyaltyDelta: -0.1
        });
        expect(TrustBoundaryEnforcementPolicy.canProgressRomance(aggregate)).toBe(false);
    });

    it("test_romance_progression_allowed_when_trust_meets_threshold", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Romance);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: [],
            sharedMemoryIds: [],
            trustDelta: 0.4,
            affinityDelta: 0.2,
            respectDelta: 0.2,
            loyaltyDelta: 0.1
        });
        expect(TrustBoundaryEnforcementPolicy.canProgressRomance(aggregate)).toBe(true);
    });

    it("test_maximum_allowed_intimacy_level", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Romance);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.9,
            contextTags: [],
            sharedMemoryIds: [],
            trustDelta: 0.4,
            affinityDelta: 0.3,
            respectDelta: 0.3,
            loyaltyDelta: 0.2
        });
        expect(TrustBoundaryEnforcementPolicy.getMaximumAllowedIntimacyLevel(aggregate)).toBe("partnered");
    });

    it("test_non_romance_bond_returns_false", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        expect(TrustBoundaryEnforcementPolicy.canProgressRomance(aggregate)).toBe(false);
    });
});
