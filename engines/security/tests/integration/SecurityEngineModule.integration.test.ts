import { describe, it, expect } from "vitest";
import { SecurityEngineModule } from "../../src/Presentation/SecurityEngineModule";

describe("SecurityEngineModule Integration", () => {
    it("should initialize and expose security engine", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        const security = module.getSecurity();
        expect(security).not.toBeNull();
        expect(security!.getSessions()).toEqual([]);
        await module.onDestroy();
    });

    it("should authenticate token", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        const security = module.getSecurity()!;

        const claims = await security.authenticateToken("token-123", "id-1");
        expect(claims.identityId).toBe("id-1");
        expect(claims.roles).toContain("user");
        expect(claims.permissions).toContain("read");
        expect(security.getSessions()).toHaveLength(1);

        await module.onDestroy();
    });

    it("should register and retrieve session", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        const security = module.getSecurity()!;

        await security.registerSession({
            sessionId: "sess-1",
            identityId: "id-1",
            claims: {},
            roles: ["user"],
            permissions: ["read"],
            nonce: "nonce-1",
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
            lastValidatedAt: Date.now(),
            status: "active",
            retryCount: 0
        });

        const session = security.getSession("sess-1");
        expect(session?.sessionId).toBe("sess-1");

        await module.onDestroy();
    });

    it("should validate permissions", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        const security = module.getSecurity()!;

        const result = await security.validatePermissions("id-1", "resource", "read", { roles: ["user"] });
        expect(result.allowed).toBe(false);
        expect(result.reason).toBe("no_matching_policy");

        await module.onDestroy();
    });

    it("should manage budget", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        const security = module.getSecurity()!;

        const budget = security.getSecurityBudget();
        expect(budget.argon2MemoryMB).toBe(64);
        expect(budget.maxCryptoOpsPerSec).toBe(200);

        const newBudget = {
            argon2MemoryMB: 32,
            argon2Iterations: 2,
            maxCryptoOpsPerSec: 50,
            tokenCacheLimitMB: 8,
            tokenCacheLimitBytes: 8 * 1024 * 1024
        };
        security.setBudget(newBudget);
        expect(security.getSecurityBudget().argon2MemoryMB).toBe(32);

        await module.onDestroy();
    });

    it("should lockout identity", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        const security = module.getSecurity()!;

        await security.registerSession({
            sessionId: "sess-1",
            identityId: "id-1",
            claims: {},
            roles: ["user"],
            permissions: ["read"],
            nonce: "nonce-1",
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
            lastValidatedAt: Date.now(),
            status: "active",
            retryCount: 0
        });

        await security.lockoutIdentity("id-1", "test_reason");
        expect(security.getAggregate().getState()).toBe("locked");

        await module.onDestroy();
    });

    it("should sanitize payload", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        const security = module.getSecurity()!;

        const threats = await security.sanitizePayload("<script>alert(1)</script>", "input");
        expect(threats).toBeGreaterThan(0);

        await module.onDestroy();
    });

    it("should revoke token", async () => {
        const module = new SecurityEngineModule();
        await module.onInit();
        const security = module.getSecurity()!;

        await security.addToken({
            tokenId: "tok-1",
            identityId: "id-1",
            tokenType: "access",
            hashedToken: "hash-1",
            expiresAt: Date.now() + 3600000,
            createdAt: Date.now(),
            lastUsedAt: Date.now(),
            revoked: false,
            rotationCount: 0
        });

        await security.revokeToken("tok-1", "compromised");
        const token = security.getToken("tok-1");
        expect(token?.revoked).toBe(true);

        await module.onDestroy();
    });
});
