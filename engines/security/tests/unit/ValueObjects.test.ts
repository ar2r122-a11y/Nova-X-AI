import { describe, it, expect } from "vitest";
import { SecurityNonce, TokenCacheKey, CredentialId, LockoutReason, SecurityBudget, Permission, Role } from "../../src/Domain/ValueObjects";

describe("SecurityNonce", () => {
    it("should create a new nonce", () => {
        const nonce = SecurityNonce.create();
        expect(nonce.getValue()).toMatch(/^nonce-/);
    });

    it("should compare equal", () => {
        const a = SecurityNonce.fromString("nonce-123");
        const b = SecurityNonce.fromString("nonce-123");
        expect(a.equals(b)).toBe(true);
    });
});

describe("TokenCacheKey", () => {
    it("should create from token", () => {
        const key = TokenCacheKey.create("abcdefghijklmnop");
        expect(key.getValue()).toMatch(/^token-/);
    });
});

describe("CredentialId", () => {
    it("should create a new credential id", () => {
        const credId = CredentialId.create();
        expect(credId.getValue()).toMatch(/^cred-/);
    });
});

describe("LockoutReason", () => {
    it("should have predefined reasons", () => {
        expect(LockoutReason.maxRetriesExceeded().getValue()).toBe("max_retries_exceeded");
        expect(LockoutReason.tamperDetected().getValue()).toBe("tamper_detected");
        expect(LockoutReason.hardwareFault().getValue()).toBe("hardware_fault");
        expect(LockoutReason.manualAdministrative().getValue()).toBe("manual_administrative");
    });
});

describe("SecurityBudget", () => {
    it("should create default budget", () => {
        const budget = SecurityBudget.create();
        expect(budget.getArgon2MemoryMB()).toBe(64);
        expect(budget.getArgon2Iterations()).toBe(3);
        expect(budget.getMaxCryptoOpsPerSec()).toBe(200);
        expect(budget.getTokenCacheLimitMB()).toBe(16);
        expect(budget.getTokenCacheLimitBytes()).toBe(16 * 1024 * 1024);
    });

    it("should create low resources budget", () => {
        const budget = SecurityBudget.forLowResources();
        expect(budget.getArgon2MemoryMB()).toBe(32);
        expect(budget.getArgon2Iterations()).toBe(2);
        expect(budget.getMaxCryptoOpsPerSec()).toBe(50);
        expect(budget.getTokenCacheLimitMB()).toBe(8);
    });
});

describe("Permission", () => {
    it("should create permission", () => {
        expect(Permission.Read.getValue()).toBe("read");
        expect(Permission.Write.getValue()).toBe("write");
        expect(Permission.Admin.getValue()).toBe("admin");
    });
});

describe("Role", () => {
    it("should create role", () => {
        expect(Role.User.getValue()).toBe("user");
        expect(Role.Moderator.getValue()).toBe("moderator");
        expect(Role.Administrator.getValue()).toBe("administrator");
        expect(Role.System.getValue()).toBe("system");
    });
});
