import { describe, it, expect } from "vitest";
import { IsActiveRelationshipSpecification } from "../../src/Domain/Specifications/IsActiveRelationshipSpecification";

describe("IsActiveRelationshipSpecification", () => {
    it("test_active_status_is_eligible", () => {
        expect(IsActiveRelationshipSpecification.isSatisfiedBy("active")).toBe(true);
        expect(IsActiveRelationshipSpecification.canProcessInteraction("active")).toBe(true);
        expect(IsActiveRelationshipSpecification.canDecay("active")).toBe(true);
        expect(IsActiveRelationshipSpecification.canReceiveEvents("active")).toBe(true);
    });

    it("test_strained_status_is_eligible", () => {
        expect(IsActiveRelationshipSpecification.isSatisfiedBy("strained")).toBe(true);
        expect(IsActiveRelationshipSpecification.canProcessInteraction("strained")).toBe(true);
        expect(IsActiveRelationshipSpecification.canDecay("strained")).toBe(true);
    });

    it("test_dormant_status_is_eligible", () => {
        expect(IsActiveRelationshipSpecification.isSatisfiedBy("dormant")).toBe(true);
        expect(IsActiveRelationshipSpecification.canDecay("dormant")).toBe(true);
    });

    it("test_severed_status_is_not_eligible", () => {
        expect(IsActiveRelationshipSpecification.isSatisfiedBy("severed")).toBe(false);
        expect(IsActiveRelationshipSpecification.canProcessInteraction("severed")).toBe(false);
        expect(IsActiveRelationshipSpecification.canDecay("severed")).toBe(false);
        expect(IsActiveRelationshipSpecification.canReceiveEvents("severed")).toBe(false);
    });

    it("test_establishing_status_is_not_eligible", () => {
        expect(IsActiveRelationshipSpecification.isSatisfiedBy("establishing")).toBe(false);
        expect(IsActiveRelationshipSpecification.canProcessInteraction("establishing")).toBe(true);
    });
});
