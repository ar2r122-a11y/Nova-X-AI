import { describe, it, expect } from "vitest";
import { SecureCredentialVault } from "../../src/Infrastructure/Vault/SecureCredentialVault";
import { WebCryptoAdapter } from "../../src/Infrastructure/Crypto/WebCryptoAdapter";
import { CredentialVaultEntry } from "../../src/Domain/Entities";

describe("SecureCredentialVault", () => {
    const adapter = new WebCryptoAdapter();
    const vault = new SecureCredentialVault(adapter);

    it("should store and retrieve entry", async () => {
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

        await vault.store(entry);
        const retrieved = await vault.retrieve("cred-1");
        expect(retrieved).toEqual(entry);
    });

    it("should return null for missing entry", async () => {
        const retrieved = await vault.retrieve("missing");
        expect(retrieved).toBeNull();
    });

    it("should delete entry", async () => {
        const entry: CredentialVaultEntry = {
            credentialId: "cred-2",
            identityId: "id-1",
            credentialType: "api_key",
            encryptedData: new ArrayBuffer(0),
            keyId: "key-1",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastAccessedAt: Date.now(),
            metadata: {}
        };

        await vault.store(entry);
        const deleted = await vault.delete("cred-2");
        expect(deleted).toBe(true);
        const retrieved = await vault.retrieve("cred-2");
        expect(retrieved).toBeNull();
    });

    it("should list entries for identity", async () => {
        const entry: CredentialVaultEntry = {
            credentialId: "cred-3",
            identityId: "id-2",
            credentialType: "certificate",
            encryptedData: new ArrayBuffer(0),
            keyId: "key-1",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastAccessedAt: Date.now(),
            metadata: {}
        };

        await vault.store(entry);
        const entries = await vault.list("id-2");
        expect(entries).toHaveLength(1);
        expect(entries[0].credentialId).toBe("cred-3");
    });
});
