import { describe, it, expect } from "vitest";
import { ConversationAggregate } from "../../../src/Domain/Aggregates/ConversationAggregate";
import { ConversationId } from "../../../src/Domain/ValueObjects/ConversationId";
import { SessionId } from "../../../src/Domain/ValueObjects/SessionId";
import { TokenBudget } from "../../../src/Domain/ValueObjects/TokenBudget";
import { CompressionStrategy } from "../../../src/Domain/ValueObjects/CompressionStrategy";
import { ParticipantId } from "../../../src/Domain/ValueObjects/ParticipantId";
import { Participant } from "../../../src/Domain/Entities/Participant";
import { MessageId } from "../../../src/Domain/ValueObjects/MessageId";
import { MessageRole } from "../../../src/Domain/ValueObjects/MessageRole";
import { TokenCount } from "../../../src/Domain/ValueObjects/TokenCount";
import { StreamChunkSequence } from "../../../src/Domain/ValueObjects/StreamChunkSequence";

describe("ConversationAggregate", () => {
    it("should create and start a conversation", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.start(ParticipantId.create("part-1"));
        expect(aggregate.getState().getValue()).toBe("waitingForAI");
        expect(aggregate.getUncommittedEvents().length).toBe(1);
    });

    it("should reject starting an already started conversation", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.start(ParticipantId.create("part-1"));
        expect(() => aggregate.start(ParticipantId.create("part-1"))).toThrow();
    });

    it("should add and remove participants", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now()));
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-2"), "user", "Bob", 1, true, Date.now()));
        expect(aggregate.getParticipants().length).toBe(2);
        aggregate.removeParticipant(ParticipantId.create("part-1"));
        expect(aggregate.getParticipants()[0].isCurrentlyActive()).toBe(false);
    });

    it("should post a message", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        const message = {
            getId: () => MessageId.create("msg-1"),
            getRole: () => MessageRole.user(),
            getContent: () => "Hello",
            getTimestamp: () => Date.now(),
            getTokenCount: () => TokenCount.create(10),
            getMetadata: () => ({}),
            getLanguageHint: () => undefined
        } as any;
        aggregate.postMessage(message, ParticipantId.create("part-1"));
        expect(aggregate.getMessages().length).toBe(1);
        expect(aggregate.getUncommittedEvents().length).toBe(1);
    });

    it("should begin and complete a turn", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        const turn = aggregate.beginTurn(MessageId.create("msg-1"));
        expect(aggregate.getTurns().length).toBe(1);
        expect(aggregate.getState().getValue()).toBe("waitingForAI");
        aggregate.completeTurn(turn, MessageId.create("msg-2"));
        expect(aggregate.getState().getValue()).toBe("idle");
        expect(aggregate.getTurns()[0].isCompleted()).toBe(true);
    });

    it("should start streaming and complete it", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now()));
        aggregate.start(ParticipantId.create("part-1"));
        aggregate.startStreaming();
        expect(aggregate.getStreamState().getValue()).toBe("active");
        aggregate.completeStreaming();
        expect(aggregate.getStreamState().getValue()).toBe("completed");
    });

    it("should append stream chunks", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now()));
        aggregate.start(ParticipantId.create("part-1"));
        aggregate.startStreaming();
        aggregate.appendStreamChunk({
            getSequence: () => StreamChunkSequence.create(0),
            getContent: () => "Hello",
            getIsLast: () => false,
            getReceivedAt: () => Date.now(),
            getIsReordered: () => false
        } as any);
        expect(aggregate.getStreamState().getValue()).toBe("active");
    });

    it("should interrupt and resume", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now()));
        aggregate.start(ParticipantId.create("part-1"));
        const checkpoint = aggregate.interrupt({ getValue: () => "userInterrupt" } as any);
        expect(aggregate.getState().getValue()).toBe("interrupted");
        expect(checkpoint).toBeDefined();
        aggregate.resumeStreaming();
        expect(aggregate.getState().getValue()).toBe("streaming");
    });

    it("should fail streaming", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now()));
        aggregate.start(ParticipantId.create("part-1"));
        aggregate.failStreaming("Network error");
        expect(aggregate.getState().getValue()).toBe("error");
        expect(aggregate.getUncommittedEvents().length).toBeGreaterThan(0);
    });

    it("should end a conversation", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now()));
        aggregate.start(ParticipantId.create("part-1"));
        aggregate.end();
        expect(aggregate.getState().getValue()).toBe("ended");
    });

    it("should record tool invocation and completion", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        const toolCall = {
            getToolCallId: () => "tool-1",
            getParentMessageId: () => MessageId.create("msg-1"),
            getToolName: () => "search",
            getArguments: () => ({}),
            getStatus: () => ({ getValue: () => "pending" } as any),
            markCompleted: function (_result: unknown) { this._status = "completed"; return this; },
            markFailed: function (_error: string) { this._status = "failed"; return this; },
            _status: "pending"
        } as any;
        (toolCall as any).getStatus = () => ({ getValue: () => toolCall._status } as any);
        aggregate.recordToolInvocation(toolCall);
        expect(aggregate.getState().getValue()).toBe("toolExecution");
        aggregate.recordToolCompletion("tool-1", { results: [] });
        aggregate.recordToolFailure("tool-1", "timeout");
    });

    it("should manage retry count", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none(),
            2
        );
        expect(aggregate.canRetry()).toBe(true);
        aggregate.incrementRetry();
        expect(aggregate.canRetry()).toBe(true);
        aggregate.incrementRetry();
        expect(aggregate.canRetry()).toBe(false);
    });

    it("should produce and commit events", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now()));
        aggregate.start(ParticipantId.create("part-1"));
        expect(aggregate.getUncommittedEvents().length).toBe(1);
        aggregate.commitEvents();
        expect(aggregate.getUncommittedEvents().length).toBe(0);
    });

    it("should snapshot and restore", () => {
        const aggregate = new ConversationAggregate(
            ConversationId.create("conv-1"),
            SessionId.create("session-1"),
            TokenBudget.default(),
            CompressionStrategy.none()
        );
        aggregate.addParticipant(Participant.create(ParticipantId.create("part-1"), "user", "Alice", 1, true, Date.now()));
        aggregate.start(ParticipantId.create("part-1"));
        const snapshot = aggregate.getSnapshot();
        aggregate.end();
        aggregate.restoreFromSnapshot(snapshot);
        expect(aggregate.getState().getValue()).toBe("waitingForAI");
    });
});
