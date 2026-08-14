/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DiagnosticSpan } from "../../../src/Domain/Entities/DiagnosticSpan";
import { SpanId } from "../../../src/Domain/ValueObjects/SpanId";

describe("DiagnosticSpan", () => {
    it("should create a span with all properties", () => {
        const span = new DiagnosticSpan({
            spanId: SpanId.create("span-1"),
            traceId: "trace-1",
            parentSpanId: null,
            name: "test-span",
            startTime: 1000,
            endTime: 1100,
            durationMs: 100,
            status: "ok",
            attributes: { key: "value" },
            engine: "core"
        });

        expect(span.getSpanId().getValue()).toBe("span-1");
        expect(span.getTraceId()).toBe("trace-1");
        expect(span.getName()).toBe("test-span");
        expect(span.getDurationMs()).toBe(100);
        expect(span.getStatus()).toBe("ok");
        expect(span.getEngine()).toBe("core");
    });

    it("should store parent span id", () => {
        const span = new DiagnosticSpan({
            spanId: SpanId.create("span-2"),
            traceId: "trace-1",
            parentSpanId: "span-1",
            name: "child-span",
            startTime: 1000,
            endTime: null,
            durationMs: null,
            status: "unset",
            attributes: {},
            engine: "analytics"
        });

        expect(span.getParentSpanId()).toBe("span-1");
    });
});
