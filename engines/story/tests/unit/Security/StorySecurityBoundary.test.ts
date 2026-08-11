import { describe, test, expect, vi } from "vitest";
import { StorySecurityBoundary } from "../../../src/Infrastructure/Security/StorySecurityBoundary";
import { StorySecurityContext } from "../../../src/Infrastructure/Security/StorySecurityContext";

describe("StorySecurityBoundary", () => {
    const mockEventBus = {
        publish: vi.fn(),
    } as any;

    const boundary = new StorySecurityBoundary(mockEventBus);

    test("authorizes command with matching role", async () => {
        const context = StorySecurityContext.create({
            userId: "user-1",
            roles: ["admin"],
            permissions: [],
            correlationId: "corr-1",
            causationId: null,
            nonce: `nonce-${Date.now()}`,
            timestamp: Date.now(),
        });

        await expect(boundary.authorizeCommand({ claims: { roles: ["admin"] } }, context)).resolves.toBeUndefined();
    });

    test("rejects command with missing role", async () => {
        const context = StorySecurityContext.create({
            userId: "user-1",
            roles: ["user"],
            permissions: [],
            correlationId: "corr-1",
            causationId: null,
            nonce: `nonce-${Date.now()}`,
            timestamp: Date.now(),
        });

        await expect(boundary.authorizeCommand({ claims: { roles: ["admin"] } }, context)).rejects.toThrow("Unauthorized");
    });

    test("rejects expired context", async () => {
        const context = StorySecurityContext.create({
            userId: "user-1",
            roles: ["admin"],
            permissions: [],
            correlationId: "corr-1",
            causationId: null,
            nonce: `nonce-${Date.now()}`,
            timestamp: Date.now() - 300001,
        });

        await expect(boundary.authorizeCommand({ claims: { roles: ["admin"] } }, context)).rejects.toThrow("expired");
    });
});
