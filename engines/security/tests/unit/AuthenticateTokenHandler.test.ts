import { describe, it, expect } from "vitest";
import { AuthenticateTokenHandler } from "../../src/Application/Handlers/AuthenticateTokenHandler";
import { AuthenticateTokenCommand } from "../../src/Application/Commands";

describe("AuthenticateTokenHandler", () => {
    it("should be instantiable", () => {
        const security = {
            authenticateToken: async () => ({ identityId: "id-1", roles: ["user"], permissions: ["read"], sessionId: "sess-1", expiresAt: Date.now() + 3600000 }),
            registerSession: async () => {},
            getEventBus: () => ({ publish: async () => {} })
        } as any;
        const handler = new AuthenticateTokenHandler(security);
        expect(handler).toBeDefined();
    });
});
