import { describe, it, expect } from "vitest";
import { RelationshipAggregate } from "../../src/Domain/Aggregates/RelationshipAggregate";
import { BondType } from "../../src/Domain/ValueObjects/BondType";

describe("RelationshipAggregate", () => {
    it("test_baseline_creation creates with correct defaults", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        expect(aggregate.getRelationshipId()).toBe("rel-1");
        expect(aggregate.getSourceEntityId()).toBe("user-1");
        expect(aggregate.getTargetEntityId()).toBe("char-1");
        expect(aggregate.getRelationshipStatus()).toBe("establishing");
        expect(aggregate.getMetrics().trust).toBe(0.5);
        expect(aggregate.getMetrics().affinity).toBe(0.0);
        expect(aggregate.getMetrics().respect).toBe(0.5);
        expect(aggregate.getMetrics().loyalty).toBe(0.5);
        expect(aggregate.getUnlockedMilestones().length).toBe(0);
    });

    it("test_establishing_to_active_transitions when trust and respect exceed threshold", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: ["meaningful"],
            sharedMemoryIds: [],
            trustDelta: 0.2,
            affinityDelta: 0.2,
            respectDelta: 0.2,
            loyaltyDelta: 0.1
        });
        expect(aggregate.getRelationshipStatus()).toBe("active");
    });

    it("test_active_to_strained_transitions when trust or respect drops", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: [],
            sharedMemoryIds: [],
            trustDelta: 0.2,
            affinityDelta: 0.2,
            respectDelta: 0.2,
            loyaltyDelta: 0.1
        });
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "casual",
            emotionalValence: -0.8,
            contextTags: [],
            sharedMemoryIds: [],
            trustDelta: -0.5,
            affinityDelta: -0.2,
            respectDelta: -0.2,
            loyaltyDelta: -0.1
        });
        expect(aggregate.getRelationshipStatus()).toBe("strained");
    });

    it("test_decay_reduces_metrics_over_time", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "casual",
            emotionalValence: 0.5,
            contextTags: [],
            sharedMemoryIds: [],
            trustDelta: 0.3,
            affinityDelta: 0.2,
            respectDelta: 0.1,
            loyaltyDelta: 0.1
        });
        const trustBeforeDecay = aggregate.getMetrics().trust;
        aggregate.executeDecayTick(86400000 * 10);
        expect(aggregate.getMetrics().trust).toBeLessThan(trustBeforeDecay);
    });

    it("test_severed_is_terminal", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: [],
            sharedMemoryIds: [],
            trustDelta: 0.2,
            affinityDelta: 0.2,
            respectDelta: 0.2,
            loyaltyDelta: 0.1
        });
        aggregate.recordBetrayal(0.99, "severe_betrayal");
        for (let i = 0; i < 10; i++) {
            aggregate.executeDecayTick(86400000 * 30);
        }
        expect(aggregate.getRelationshipStatus()).toBe("severed");
    });

    it("test_reconstitute_restores_aggregate_from_snapshot", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: ["meaningful"],
            sharedMemoryIds: ["mem-1"],
            trustDelta: 0.3,
            affinityDelta: 0.2,
            respectDelta: 0.1,
            loyaltyDelta: 0.1
        });
        const snapshot = aggregate.getSnapshot() as any;
        const restored = RelationshipAggregate.reconstitute(snapshot);
        expect(restored.getRelationshipId()).toBe("rel-1");
        expect(restored.getRelationshipStatus()).toBe(aggregate.getRelationshipStatus());
        expect(restored.getSharedMemoryIds()).toContain("mem-1");
    });

    it("test_shared_memory_references_are_tracked", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        aggregate.processInteraction({
            sourceEntityId: "user-1",
            targetEntityId: "char-1",
            interactionType: "deep_conversation",
            emotionalValence: 0.8,
            contextTags: ["meaningful"],
            sharedMemoryIds: ["mem-1", "mem-2"],
            trustDelta: 0.1,
            affinityDelta: 0.1,
            respectDelta: 0.1,
            loyaltyDelta: 0.1
        });
        expect(aggregate.getSharedMemoryIds()).toContain("mem-1");
        expect(aggregate.getSharedMemoryIds()).toContain("mem-2");
    });
});
