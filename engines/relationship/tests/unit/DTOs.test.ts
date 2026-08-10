import { describe, it, expect } from "vitest";
import { RelationshipSnapshotDto } from "../../src/Application/DTO/RelationshipSnapshotDto";
import { RelationshipContextDto } from "../../src/Application/DTO/RelationshipContextDto";
import { SocialGraphNodeDto } from "../../src/Application/DTO/SocialGraphNodeDto";
import { RelationshipMilestoneDto } from "../../src/Application/DTO/RelationshipMilestoneDto";
import { RelationshipAggregate } from "../../src/Domain/Aggregates/RelationshipAggregate";
import { BondType } from "../../src/Domain/ValueObjects/BondType";
import { MilestoneDescriptor } from "../../src/Domain/ValueObjects/MilestoneDescriptor";

describe("DTOs", () => {
    it("RelationshipSnapshotDto_fromAggregate_produces_read_only_snapshot", () => {
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
            respectDelta: 0.1,
            loyaltyDelta: 0.1
        });
        const dto = RelationshipSnapshotDto.fromAggregate(aggregate);
        expect(dto.relationshipId).toBe("rel-1");
        expect(dto.sourceEntityId).toBe("user-1");
        expect(dto.targetEntityId).toBe("char-1");
        expect(dto.trust).toBeGreaterThan(0.5);
    });

    it("RelationshipContextDto_fromAggregate_provides_concise_context", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const dto = RelationshipContextDto.fromAggregate(aggregate);
        expect(dto.promptContext).toContain("Relationship:");
        expect(dto.promptContext).toContain("Trust:");
    });

    it("SocialGraphNodeDto_fromAggregates_builds_node", () => {
        const aggregate = RelationshipAggregate.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const dto = SocialGraphNodeDto.fromAggregates("user-1", [aggregate]);
        expect(dto.entityId).toBe("user-1");
        expect(dto.connectionCount).toBe(1);
    });

    it("RelationshipMilestoneDto_fromDescriptor_maps_fields", () => {
        const descriptor = MilestoneDescriptor.create("milestone-1", "First Bond", "Description", 0.5, 0.3, 0.4, 0.4, "friendship");
        const dto = RelationshipMilestoneDto.fromDescriptor(descriptor);
        expect(dto.milestoneId).toBe("milestone-1");
        expect(dto.name).toBe("First Bond");
    });
});
