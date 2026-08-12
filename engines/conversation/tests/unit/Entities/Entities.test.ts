import { describe, it, expect } from "vitest";
import { Participant } from "../../../src/Domain/Entities/Participant";
import { ParticipantId } from "../../../src/Domain/ValueObjects/ParticipantId";
import { Message } from "../../../src/Domain/Entities/Message";
import { MessageId } from "../../../src/Domain/ValueObjects/MessageId";
import { MessageRole } from "../../../src/Domain/ValueObjects/MessageRole";
import { TokenCount } from "../../../src/Domain/ValueObjects/TokenCount";
import { ToolCall } from "../../../src/Domain/Entities/ToolCall";
import { ToolResult } from "../../../src/Domain/Entities/ToolResult";
import { Turn } from "../../../src/Domain/Entities/Turn";
import { StreamChunkRecord } from "../../../src/Domain/Entities/StreamChunkRecord";
import { StreamChunkSequence } from "../../../src/Domain/ValueObjects/StreamChunkSequence";

describe("Entities", () => {
    it("should create and deactivate Participant", () => {
        const participant = Participant.create(
            ParticipantId.create("part-1"),
            "user",
            "Alice",
            1,
            true,
            Date.now()
        );
        expect(participant.isCurrentlyActive()).toBe(true);
        const deactivated = participant.deactivate();
        expect(deactivated.isCurrentlyActive()).toBe(false);
    });

    it("should create Message with metadata", () => {
        const message = Message.create(
            MessageId.create("msg-1"),
            MessageRole.user(),
            "Hello world",
            TokenCount.create(10),
            "en",
            { key: "value" }
        );
        expect(message.getContent()).toBe("Hello world");
        expect(message.getLanguageHint()).toBe("en");
        expect(message.getMetadata()).toEqual({ key: "value" });
    });

    it("should create ToolCall and transition status", () => {
        const toolCall = ToolCall.create(
            "tool-1",
            MessageId.create("msg-1"),
            "search",
            { query: "test" }
        );
        expect(toolCall.getStatus().getValue()).toBe("pending");
        const executing = toolCall.markExecuting();
        expect(executing.getStatus().getValue()).toBe("executing");
        const completed = executing.markCompleted({ results: [] });
        expect(completed.getStatus().getValue()).toBe("completed");
    });

    it("should create ToolResult success and error", () => {
        const success = ToolResult.success("tool-1", "done", TokenCount.create(5), 100);
        expect(success.isErrorResult()).toBe(false);
        const error = ToolResult.error("tool-1", "failed", TokenCount.create(5), 100);
        expect(error.isErrorResult()).toBe(true);
    });

    it("should create Turn", () => {
        const turn = Turn.create("turn-1", 1, MessageId.create("msg-1"), Date.now(), TokenCount.create(10));
        expect(turn.getSequenceNumber()).toBe(1);
        const completed = turn.withAssistantMessage(MessageId.create("msg-2"));
        expect(completed.isCompleted()).toBe(true);
    });

    it("should add tool call to Turn", () => {
        const turn = Turn.create("turn-1", 1, MessageId.create("msg-1"), Date.now(), TokenCount.create(10));
        const updated = turn.addToolCall("tool-1");
        expect(updated.getToolCalls()).toEqual(["tool-1"]);
    });

    it("should create StreamChunkRecord", () => {
        const chunk = StreamChunkRecord.create(
            StreamChunkSequence.create(0),
            "Hello",
            false,
            false
        );
        expect(chunk.getContent()).toBe("Hello");
        expect(chunk.getIsLast()).toBe(false);
    });
});
