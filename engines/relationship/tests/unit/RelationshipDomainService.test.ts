import { describe, it, expect } from "vitest";
import { RelationshipDomainServiceImpl } from "../../src/Domain/Services/RelationshipDomainServiceImpl";
import { RelationshipAggregate } from "../../src/Domain/Aggregates/RelationshipAggregate";
import { BondType } from "../../src/Domain/ValueObjects/BondType";

describe("RelationshipDomainService", () => {
    const service = new RelationshipDomainServiceImpl();

    it("test_process_interaction_updates_metrics", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        service.processInteraction(aggregate, {
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: ["meaningful"],
            sharedMemoryIds: ["mem-1"],
            trustDelta: 0.2,
            affinityDelta: 0.2,
            respectDelta: 0.1,
            loyaltyDelta: 0.1
        });
        expect(aggregate.getMetrics().trust).toBeGreaterThan(0.5);
        expect(aggregate.getSharedMemoryIds()).toContain("mem-1");
    });

    it("test_evaluate_decay_reduces_metrics", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const initialTrust = aggregate.getMetrics().trust;
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: [],
            sharedMemoryIds: [],
            trustDelta: 0.3,
            affinityDelta: 0.2,
            respectDelta: 0.1,
            loyaltyDelta: 0.1
        });
        service.evaluateDecay(aggregate, 86400000 * 10);
        expect(aggregate.getMetrics().trust).toBeLessThan(initialTrust + 0.3);
    });
});
