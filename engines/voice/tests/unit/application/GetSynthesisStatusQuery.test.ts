import { describe, it, expect } from "vitest";
import { GetSynthesisStatusQuery } from "../../../src/Application/Queries/GetSynthesisStatusQuery";

describe("GetSynthesisStatusQuery", () => {
    it("creates with required voiceId and requestId", () => {
        const query = new GetSynthesisStatusQuery("voice-1", "req-1");
        expect(query.voiceId).toBe("voice-1");
        expect(query.requestId).toBe("req-1");
    });

    it("has undefined requesterId by default", () => {
        const query = new GetSynthesisStatusQuery("voice-1", "req-1");
        expect(query.requesterId).toBeUndefined();
    });

    it("accepts optional requesterId", () => {
        const query = new GetSynthesisStatusQuery("voice-1", "req-1", "user-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("implements IQuery", () => {
        const query = new GetSynthesisStatusQuery("voice-1", "req-1");
        expect(typeof query).toBe("object");
        expect("voiceId" in query).toBe(true);
        expect("requestId" in query).toBe(true);
        expect("requesterId" in query).toBe(true);
    });
});
