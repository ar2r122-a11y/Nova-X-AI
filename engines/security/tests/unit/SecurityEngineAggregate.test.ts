import { describe, it, expect } from "vitest";
import { SecurityEngineAggregate } from "../../src/Domain/Aggregates";
import { SecuritySession, SecurityToken, SecurityPolicy, CredentialVaultEntry, AuditLogEntry } from "../../src/Domain/Entities";
import { LockoutReason } from "../../src/Domain/ValueObjects";

describe("SecurityEngineAggregate", () => {
    it("should initialize with default state", () => {
        const aggregate = new SecurityEngineAggregate();
        expect(aggregate.getState()).toBe("initialized");
    });

    it("should register and retrieve sessions", () => {
        const aggregate = new SecurityEngineAggregate();

        const session: SecuritySession = {
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
        };

        aggregate.registerSession(session);
        expect(aggregate.getSession("sess-1")).toEqual(session);
        expect(aggregate.getSessions()).toHaveLength(1);
    });

    it("should validate active sessions", () => {
        const aggregate = new SecurityEngineAggregate();

        const session: SecuritySession = {
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
        };

        aggregate.registerSession(session);
        expect(aggregate.validateSession("sess-1")).toEqual(session);
    });

    it("should not validate expired sessions", () => {
        const aggregate = new SecurityEngineAggregate();

        const session: SecuritySession = {
            sessionId: "sess-1",
            identityId: "id-1",
            claims: {},
            roles: ["user"],
            permissions: ["read"],
            nonce: "nonce-1",
            createdAt: Date.now() - 7200000,
            expiresAt: Date.now() - 3600000,
            lastValidatedAt: Date.now() - 7200000,
            status: "active",
            retryCount: 0
        };

        aggregate.registerSession(session);
        expect(aggregate.validateSession("sess-1")).toBeUndefined();
    });

    it("should increment retry count", () => {
        const aggregate = new SecurityEngineAggregate();

        const session: SecuritySession = {
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
        };

        aggregate.registerSession(session);
        const updated = aggregate.incrementRetry("sess-1");
        expect(updated?.retryCount).toBe(1);
    });

    it("should lock session and update state", () => {
        const aggregate = new SecurityEngineAggregate();

        const session: SecuritySession = {
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
        };

        aggregate.registerSession(session);
        aggregate.lockSession("sess-1", LockoutReason.maxRetriesExceeded());
        expect(aggregate.getState()).toBe("locked");
        expect(aggregate.getSession("sess-1")?.status).toBe("locked");
    });

    it("should revoke tokens", () => {
        const aggregate = new SecurityEngineAggregate();

        const token: SecurityToken = {
            tokenId: "tok-1",
            identityId: "id-1",
            tokenType: "access",
            hashedToken: "hash-1",
            expiresAt: Date.now() + 3600000,
            createdAt: Date.now(),
            lastUsedAt: Date.now(),
            revoked: false,
            rotationCount: 0
        };

        aggregate.addToken(token);
        const revoked = aggregate.revokeToken("tok-1");
        expect(revoked?.revoked).toBe(true);
    });

    it("should manage policies", () => {
        const aggregate = new SecurityEngineAggregate();

        const policy: SecurityPolicy = {
            policyId: "pol-1",
            name: "test",
            effect: "allow",
            resource: "*",
            action: "*",
            conditions: {},
            priority: 100,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        aggregate.addPolicy(policy);
        expect(aggregate.getAllPolicies()).toHaveLength(1);
        expect(aggregate.getPolicy("pol-1")).toEqual(policy);
    });

    it("should manage vault entries", () => {
        const aggregate = new SecurityEngineAggregate();

        const entry: CredentialVaultEntry = {
            credentialId: "cred-1",
            identityId: "id-1",
            credentialType: "password",
            encryptedData: new ArrayBuffer(0),
            keyId: "key-1",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastAccessedAt: Date.now(),
            metadata: {}
        };

        aggregate.storeVaultEntry(entry);
        expect(aggregate.getVaultEntry("cred-1")).toEqual(entry);
    });

    it("should append and retrieve audit log", () => {
        const aggregate = new SecurityEngineAggregate();

        const entry: AuditLogEntry = {
            logId: "audit-1",
            identityId: "id-1",
            action: "login",
            resource: "system",
            result: "success",
            timestamp: Date.now(),
            correlationId: "corr-1",
            metadata: {},
            signature: "sig-1"
        };

        aggregate.appendAuditLog(entry);
        const log = aggregate.getAuditLog();
        expect(log).toHaveLength(1);
        expect(log[0]).toEqual(entry);
    });
});
