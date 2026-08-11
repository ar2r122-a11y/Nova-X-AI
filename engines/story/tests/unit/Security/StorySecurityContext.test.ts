import { describe, test, expect, vi } from "vitest";
import { StorySecurityContext } from "../../../src/Infrastructure/Security/StorySecurityContext";

describe("StorySecurityContext", () => {
    test("creates context from data", () => {
        const context = StorySecurityContext.create({
            userId: "user-1",
            roles: ["admin"],
            permissions: ["story.write"],
            correlationId: "corr-1",
            causationId: "cause-1",
            nonce: "nonce-1",
            timestamp: Date.now(),
        });

        expect(context.userId).toBe("user-1");
        expect(context.hasRole("admin")).toBe(true);
        expect(context.hasPermission("story.write")).toBe(true);
    });

    test("detects expired context", () => {
        const context = StorySecurityContext.create({
            userId: "user-1",
            roles: [],
            permissions: [],
            correlationId: "corr-1",
            causationId: null,
            nonce: "nonce-1",
            timestamp: Date.now() - 300001,
        });

        expect(context.isExpired(300000)).toBe(true);
    });

    test("detects nonce replay", () => {
        const context = StorySecurityContext.create({
            userId: "user-1",
            roles: [],
            permissions: [],
            correlationId: "corr-1",
            causationId: null,
            nonce: "reused-nonce",
            timestamp: Date.now(),
        });

        context.validateNonce();
        expect(() => context.validateNonce()).toThrow("Nonce replay detected");
    });

    test("detects tamper on null payload", () => {
        expect(StorySecurityContext.detectTamper(null)).toBe(true);
        expect(StorySecurityContext.detectTamper(undefined)).toBe(true);
        expect(StorySecurityContext.detectTamper({})).toBe(false);
    });
});
