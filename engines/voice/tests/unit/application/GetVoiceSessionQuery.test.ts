import { describe, it, expect } from "vitest";
import { GetVoiceSessionQuery } from "../../../src/Application/Queries/GetVoiceSessionQuery";

describe("GetVoiceSessionQuery", () => {
    it("creates with required sessionId", () => {
        const query = new GetVoiceSessionQuery("session-1");
        expect(query.sessionId).toBe("session-1");
    });

    it("has undefined requesterId by default", () => {
        const query = new GetVoiceSessionQuery("session-1");
        expect(query.requesterId).toBeUndefined();
    });

    it("accepts optional requesterId", () => {
        const query = new GetVoiceSessionQuery("session-1", "user-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("implements IQuery", () => {
        const query = new GetVoiceSessionQuery("session-1");
        expect(typeof query).toBe("object");
        expect("sessionId" in query).toBe(true);
        expect("requesterId" in query).toBe(true);
    });
});
