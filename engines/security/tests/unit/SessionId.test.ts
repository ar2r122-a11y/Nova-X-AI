import { describe, it, expect } from "vitest";
import { SessionId } from "../../src/Domain/ValueObjects/index";

describe("SessionId", () => {
    it("should create a new session id", () => {
        const sessionId = SessionId.create();
        expect(sessionId.getValue()).toMatch(/^sess-/);
    });

    it("should create from string", () => {
        const sessionId = SessionId.fromString("sess-123");
        expect(sessionId.getValue()).toBe("sess-123");
    });

    it("should compare equal", () => {
        const a = SessionId.fromString("sess-123");
        const b = SessionId.fromString("sess-123");
        expect(a.equals(b)).toBe(true);
    });

    it("should compare not equal", () => {
        const a = SessionId.fromString("sess-123");
        const b = SessionId.fromString("sess-456");
        expect(a.equals(b)).toBe(false);
    });
});
