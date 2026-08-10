import { describe, it, expect } from "vitest";
import { RelationshipAggregateFactory } from "../../src/Domain/Factories/RelationshipAggregateFactory";
import { BondType } from "../../src/Domain/ValueObjects/BondType";
import { RelationshipMetrics } from "../../src/Domain/ValueObjects/RelationshipMetrics";

describe("RelationshipAggregateFactory", () => {
    it("test_baseline_factory_values produce correct defaults", () => {
        const aggregate = RelationshipAggregateFactory.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const metrics = aggregate.getMetrics();
        expect(metrics.trust).toBeCloseTo(0.5);
        expect(metrics.affinity).toBeCloseTo(0.0);
        expect(metrics.respect).toBeCloseTo(0.5);
        expect(metrics.loyalty).toBeCloseTo(0.5);
        expect(aggregate.getRelationshipStatus()).toBe("establishing");
    });

    it("test_reconstitute_from_snapshot", () => {
        const aggregate = RelationshipAggregateFactory.create("rel-1", "user-1", "char-1", BondType.Friendship);
        const snapshot = aggregate.getSnapshot() as any;
        const restored = RelationshipAggregateFactory.reconstitute(snapshot);
        expect(restored.getRelationshipId()).toBe("rel-1");
        expect(restored.getMetrics().trust).toBeCloseTo(0.5);
    });
});

describe("RelationshipMetrics", () => {
    it("test_bounds_validation_clamps_values", () => {
        const metrics = RelationshipMetrics.create(1.5, -2.0, 0.5, 0.5);
        expect(metrics.trust).toBeCloseTo(1.0);
        expect(metrics.affinity).toBeCloseTo(-1.0);
        expect(metrics.respect).toBeCloseTo(0.5);
        expect(metrics.loyalty).toBeCloseTo(0.5);
    });

    it("test_baseline_values", () => {
        const baseline = RelationshipMetrics.baseline();
        expect(baseline.trust).toBeCloseTo(0.5);
        expect(baseline.affinity).toBeCloseTo(0.0);
        expect(baseline.respect).toBeCloseTo(0.5);
        expect(baseline.loyalty).toBeCloseTo(0.5);
    });

    it("test_with_methods_creates_new_instances", () => {
        const metrics = RelationshipMetrics.create(0.5, 0.0, 0.5, 0.5);
        const updated = metrics.withTrust(0.8);
        expect(updated.trust).toBeCloseTo(0.8);
        expect(updated.affinity).toBeCloseTo(0.0);
        expect(metrics.trust).toBeCloseTo(0.5);
    });
});
