import { describe, it, expect, vi } from "vitest";
import { EncryptionBoundary } from "../../src/Infrastructure/Persistence/EncryptionBoundary.ts";

describe("EncryptionBoundary", () => {
    it("should encrypt and decrypt data", async () => {
        const boundary = new EncryptionBoundary();
        const data = new TextEncoder().encode("secret").buffer;
        const encrypted = await boundary.encrypt(data, "key-1");
        expect(encrypted.keyId).toBe("key-1");
        const decrypted = await boundary.decrypt(encrypted.data, encrypted.keyId);
        const text = new TextDecoder().decode(decrypted);
        expect(text).toBe("secret");
    });
});
