import type { ISecurityVault, ICryptoAdapter } from "../../Contracts";
import { CredentialVaultEntry } from "../../Domain/Entities";
import { CredentialId } from "../../Domain/ValueObjects";

export class SecureCredentialVault implements ISecurityVault {
    private entries = new Map<string, CredentialVaultEntry>();
    private crypto: ICryptoAdapter;

    constructor(crypto: ICryptoAdapter) {
        this.crypto = crypto;
    }

    async store(entry: CredentialVaultEntry): Promise<void> {
        this.entries.set(entry.credentialId, entry);
    }

    async retrieve(credentialId: string): Promise<CredentialVaultEntry | null> {
        const entry = this.entries.get(credentialId);
        if (!entry) return null;
        return entry;
    }

    async delete(credentialId: string): Promise<boolean> {
        return this.entries.delete(credentialId);
    }

    async list(identityId?: string): Promise<CredentialVaultEntry[]> {
        const all = Array.from(this.entries.values());
        if (!identityId) return all;
        return all.filter(entry => entry.identityId === identityId);
    }

    async rotateKey(oldKeyId: string, newKeyId: string): Promise<void> {
        await this.crypto.rotateKey(oldKeyId, newKeyId);
    }
}
