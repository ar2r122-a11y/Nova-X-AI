import { describe, it, expect } from "vitest";
import { ConversationId } from "../../../src/Domain/ValueObjects/ConversationId";
import { SessionId } from "../../../src/Domain/ValueObjects/SessionId";
import { MessageId } from "../../../src/Domain/ValueObjects/MessageId";
import { ParticipantId } from "../../../src/Domain/ValueObjects/ParticipantId";
import { TokenCount } from "../../../src/Domain/ValueObjects/TokenCount";
import { TokenBudget } from "../../../src/Domain/ValueObjects/TokenBudget";
import { LanguageCode } from "../../../src/Domain/ValueObjects/LanguageCode";
import { MessageRole } from "../../../src/Domain/ValueObjects/MessageRole";
import { ConversationState } from "../../../src/Domain/ValueObjects/ConversationState";
import { StreamState } from "../../../src/Domain/ValueObjects/StreamState";
import { InterruptionType } from "../../../src/Domain/ValueObjects/InterruptionType";
import { RetryStrategy } from "../../../src/Domain/ValueObjects/RetryStrategy";
import { ToolCallStatus } from "../../../src/Domain/ValueObjects/ToolCallStatus";
import { CompressionStrategy } from "../../../src/Domain/ValueObjects/CompressionStrategy";
import { PriorityLevel } from "../../../src/Domain/ValueObjects/PriorityLevel";
import { StreamChunkSequence } from "../../../src/Domain/ValueObjects/StreamChunkSequence";

describe("ValueObjects", () => {
    it("should create ConversationId", () => {
        const id = ConversationId.create("conv-123");
        expect(id.getValue()).toBe("conv-123");
        expect(id.toString()).toBe("conv-123");
    });

    it("should reject empty ConversationId", () => {
        expect(() => ConversationId.create("")).toThrow("ConversationId cannot be empty.");
    });

    it("should create SessionId", () => {
        const id = SessionId.create("session-123");
        expect(id.getValue()).toBe("session-123");
    });

    it("should create MessageId", () => {
        const id = MessageId.create("msg-123");
        expect(id.getValue()).toBe("msg-123");
    });

    it("should create ParticipantId", () => {
        const id = ParticipantId.create("part-123");
        expect(id.getValue()).toBe("part-123");
    });

    it("should create TokenCount", () => {
        const count = TokenCount.create(100);
        expect(count.getValue()).toBe(100);
        expect(count.add(TokenCount.create(50)).getValue()).toBe(150);
        expect(count.subtract(TokenCount.create(30)).getValue()).toBe(70);
    });

    it("should reject negative TokenCount", () => {
        expect(() => TokenCount.create(-1)).toThrow("TokenCount must be a non-negative integer.");
    });

    it("should create TokenBudget with validation", () => {
        const budget = TokenBudget.create(TokenCount.create(4096), TokenCount.create(1024), TokenCount.create(2048));
        expect(budget.getTotalBudget().getValue()).toBe(4096);
        expect(budget.getContextWindow().getValue()).toBe(1024);
    });

    it("should reject TokenBudget exceeding total", () => {
        expect(() => TokenBudget.create(TokenCount.create(100), TokenCount.create(60), TokenCount.create(60))).toThrow();
    });

    it("should detect language codes", () => {
        expect(LanguageCode.english().getValue()).toBe("en");
        expect(LanguageCode.arabic().getValue()).toBe("ar");
        expect(LanguageCode.mixed().getValue()).toBe("mixed");
    });

    it("should create MessageRole", () => {
        expect(MessageRole.user().getValue()).toBe("user");
        expect(MessageRole.assistant().getValue()).toBe("assistant");
    });

    it("should reject invalid MessageRole", () => {
        expect(() => MessageRole.fromString("invalid")).toThrow("Unknown MessageRole: invalid");
    });

    it("should create ConversationState", () => {
        expect(ConversationState.idle().getValue()).toBe("idle");
        expect(ConversationState.waitingForAI().getValue()).toBe("waitingForAI");
    });

    it("should create StreamState", () => {
        expect(StreamState.inactive().getValue()).toBe("inactive");
        expect(StreamState.active().getValue()).toBe("active");
    });

    it("should create InterruptionType", () => {
        expect(InterruptionType.stopGeneration().getValue()).toBe("stopGeneration");
        expect(InterruptionType.cancelStream().getValue()).toBe("cancelStream");
    });

    it("should create RetryStrategy", () => {
        expect(RetryStrategy.none().getValue()).toBe("none");
        expect(RetryStrategy.exponentialBackoff().getValue()).toBe("exponentialBackoff");
    });

    it("should create ToolCallStatus", () => {
        expect(ToolCallStatus.pending().getValue()).toBe("pending");
        expect(ToolCallStatus.completed().getValue()).toBe("completed");
    });

    it("should create CompressionStrategy", () => {
        expect(CompressionStrategy.none().getValue()).toBe("none");
        expect(CompressionStrategy.slidingWindow().getValue()).toBe("slidingWindow");
    });

    it("should create PriorityLevel", () => {
        expect(PriorityLevel.low().getValue()).toBe(1);
        expect(PriorityLevel.critical().getValue()).toBe(4);
        expect(() => PriorityLevel.create(0)).toThrow();
    });

    it("should create StreamChunkSequence", () => {
        const seq = StreamChunkSequence.initial();
        expect(seq.getValue()).toBe(0);
        expect(seq.next().getValue()).toBe(1);
    });
});
