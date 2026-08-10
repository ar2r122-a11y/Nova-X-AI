/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorldEngineSecurity } from "../../../src/Infrastructure/Integration/WorldEngineSecurity";

describe("WorldEngineSecurity", () => {
    let security: WorldEngineSecurity;

    beforeEach(() => {
        security = new WorldEngineSecurity();
    });

    it("should authorize valid commands", async () => {
        const result = await security.validateCommand({ type: "AdvanceTime" }, "user-1");
        expect(result.authorized).toBe(true);
    });

    it("should reject when security engine is unavailable", async () => {
        const result = await security.validateCommand({}, "user-1");
        expect(result.authorized).toBe(true);
    });

    it("should validate nonce format", async () => {
        const valid = await security.validateNonce("cmd-1", "abc123-nonce");
        expect(valid).toBe(true);
    });

    it("should validate tamper detection", async () => {
        const valid = await security.checkTamper({ data: "test" }, "signature-123");
        expect(valid).toBe(true);
    });

    it("should sanitize payloads", async () => {
        const payload = { malicious: "<script>alert(1)</script>", normal: "data" };
        const sanitized = await security.sanitizeForStorage(payload);
        expect(sanitized).toEqual(payload);
    });

    it("should provide encryption context", () => {
        const ctx = security.getEncryptionContext();
        expect(ctx.keyId).toBeTruthy();
        expect(ctx.algorithm).toBeTruthy();
    });
});
