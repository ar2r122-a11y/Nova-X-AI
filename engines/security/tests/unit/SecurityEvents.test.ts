import { describe, it, expect } from "vitest";
import { SessionValidatedEvent, ExecutionFailedEvent, LockoutEvent, AccessDeniedEvent, TokenRevokedEvent, KeyRotatedEvent, CredentialIsolatedEvent, PayloadSanitizedEvent, SecurityBudgetExceededEvent } from "../../src/Domain/Events";

describe("Security Events", () => {
    it("SessionValidatedEvent should implement IDomainEvent", () => {
        const event = new SessionValidatedEvent("sess-1", "id-1", ["user"], ["read"], "corr-1");
        expect(event.eventType).toBe("EVT_SEC_SessionValidated");
        expect(event.timestamp).toBeGreaterThan(0);
        expect(event.correlationId).toBe("corr-1");
    });

    it("ExecutionFailedEvent should implement IDomainEvent", () => {
        const event = new ExecutionFailedEvent("op-1", "error-1", 3, "corr-1");
        expect(event.eventType).toBe("EVT_SEC_ExecutionFailed");
        expect(event.operation).toBe("op-1");
        expect(event.retryCount).toBe(3);
    });

    it("LockoutEvent should implement IDomainEvent", () => {
        const event = new LockoutEvent("id-1", "reason-1", 5, "corr-1");
        expect(event.eventType).toBe("EVT_SEC_Lockout");
        expect(event.identityId).toBe("id-1");
        expect(event.reason).toBe("reason-1");
    });

    it("AccessDeniedEvent should implement IDomainEvent", () => {
        const event = new AccessDeniedEvent("id-1", "res-1", "act-1", "denied", "corr-1");
        expect(event.eventType).toBe("EVT_SEC_AccessDenied");
        expect(event.resource).toBe("res-1");
        expect(event.action).toBe("act-1");
    });

    it("TokenRevokedEvent should implement IDomainEvent", () => {
        const event = new TokenRevokedEvent("tok-1", "id-1", "compromised", "corr-1");
        expect(event.eventType).toBe("EVT_SEC_TokenRevoked");
        expect(event.tokenId).toBe("tok-1");
    });

    it("KeyRotatedEvent should implement IDomainEvent", () => {
        const event = new KeyRotatedEvent("new-key", "old-key", "AES-GCM", "corr-1");
        expect(event.eventType).toBe("EVT_SEC_KeyRotated");
        expect(event.keyId).toBe("new-key");
        expect(event.previousKeyId).toBe("old-key");
    });

    it("CredentialIsolatedEvent should implement IDomainEvent", () => {
        const event = new CredentialIsolatedEvent("cred-1", "id-1", "hardware", "corr-1");
        expect(event.eventType).toBe("EVT_SEC_CredentialIsolated");
        expect(event.credentialId).toBe("cred-1");
    });

    it("PayloadSanitizedEvent should implement IDomainEvent", () => {
        const event = new PayloadSanitizedEvent("res-1", 3, Date.now(), "corr-1");
        expect(event.eventType).toBe("EVT_SEC_PayloadSanitized");
        expect(event.threatsRemoved).toBe(3);
    });

    it("SecurityBudgetExceededEvent should implement IDomainEvent", () => {
        const event = new SecurityBudgetExceededEvent("crypto", 100, 101, "corr-1");
        expect(event.eventType).toBe("EVT_SEC_BudgetExceeded");
        expect(event.limit).toBe(100);
        expect(event.current).toBe(101);
    });
});
