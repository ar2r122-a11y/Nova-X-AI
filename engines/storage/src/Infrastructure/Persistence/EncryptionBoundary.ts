import { IEncryptionBoundary } from "../../Contracts";

export class EncryptionBoundary implements IEncryptionBoundary {
    private readonly keyStore = new Map<string, CryptoKey>();

    async encrypt(data: ArrayBuffer, keyId: string): Promise<{ data: ArrayBuffer; keyId: string }> {
        const key = await this.getOrCreateKey(keyId);
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            data
        );

        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        return { data: combined.buffer, keyId };
    }

    async decrypt(data: ArrayBuffer, keyId: string): Promise<ArrayBuffer> {
        const key = await this.getOrCreateKey(keyId);
        const combined = new Uint8Array(data);
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        return crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );
    }

    async rotateKey(oldKeyId: string, newKeyId: string): Promise<void> {
        await this.getOrCreateKey(oldKeyId);
        const newKey = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        this.keyStore.set(newKeyId, newKey);
        this.keyStore.delete(oldKeyId);
    }

    private async getOrCreateKey(keyId: string): Promise<CryptoKey> {
        const existing = this.keyStore.get(keyId);
        if (existing) return existing;

        const keyData = new TextEncoder().encode(keyId.padEnd(32, "0").slice(0, 32));
        const key = await crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["encrypt", "decrypt"]);
        this.keyStore.set(keyId, key);
        return key;
    }
}
