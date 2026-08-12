import { describe, it, expect } from "vitest";
import { IsActiveSessionSpecification } from "../../../src/Domain/Specifications/IsActiveSessionSpecification";
import { IsWithinTokenBudgetSpecification } from "../../../src/Domain/Specifications/IsWithinTokenBudgetSpecification";
import { IsParticipantAuthorizedSpecification } from "../../../src/Domain/Specifications/IsParticipantAuthorizedSpecification";
import { CanInterruptSpecification } from "../../../src/Domain/Specifications/CanInterruptSpecification";
import { CanRetrySpecification } from "../../../src/Domain/Specifications/CanRetrySpecification";
import { ConversationState } from "../../../src/Domain/ValueObjects/ConversationState";
import { TokenCount } from "../../../src/Domain/ValueObjects/TokenCount";
import { Participant } from "../../../src/Domain/Entities/Participant";
import { ParticipantId } from "../../../src/Domain/ValueObjects/ParticipantId";

describe("Specifications", () => {
    it("IsActiveSessionSpecification should match active states", () => {
        expect(IsActiveSessionSpecification.isSatisfiedBy(ConversationState.idle())).toBe(true);
        expect(IsActiveSessionSpecification.isSatisfiedBy(ConversationState.ended())).toBe(false);
        expect(IsActiveSessionSpecification.isSatisfiedBy(ConversationState.error())).toBe(false);
    });

    it("IsWithinTokenBudgetSpecification should validate budget", () => {
        const spec = new IsWithinTokenBudgetSpecification(TokenCount.create(100));
        expect(spec.isSatisfied(TokenCount.create(50))).toBe(true);
        expect(spec.isSatisfied(TokenCount.create(150))).toBe(false);
    });

    it("IsParticipantAuthorizedSpecification should validate authorization", () => {
        const participant = Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now());
        const spec = new IsParticipantAuthorizedSpecification(["part-1", "part-2"]);
        expect(spec.isSatisfied(participant)).toBe(true);
        const spec2 = new IsParticipantAuthorizedSpecification(["part-3"]);
        expect(spec2.isSatisfied(participant)).toBe(false);
    });

    it("CanInterruptSpecification should match interruptible states", () => {
        expect(CanInterruptSpecification.isSatisfiedBy(ConversationState.waitingForAI())).toBe(true);
        expect(CanInterruptSpecification.isSatisfiedBy(ConversationState.streaming())).toBe(true);
        expect(CanInterruptSpecification.isSatisfiedBy(ConversationState.ended())).toBe(false);
    });

    it("CanRetrySpecification should validate retry eligibility", () => {
        const spec = new CanRetrySpecification(3);
        expect(spec.isSatisfied(0)).toBe(true);
        expect(spec.isSatisfied(3)).toBe(false);
    });
});
