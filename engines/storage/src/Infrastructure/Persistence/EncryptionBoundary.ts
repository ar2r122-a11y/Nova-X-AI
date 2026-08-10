import { IEncryptionBoundary } from "../../Contracts";

export class EncryptionBoundary implements IEncryptionBoundary {
    async encrypt(data: ArrayBuffer, keyId: string): Promise<{ data: ArrayBuffer; keyId: string }> {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.getKey(keyId);

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
        const combined = new Uint8Array(data);
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);
        const key = await this.getKey(keyId);

        return crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );
    }

    async rotateKey(_oldKeyId: string, _newKeyId: string): Promise<void> {
    }

    private async getKey(keyId: string): Promise<CryptoKey> {
        const keyData = new TextEncoder().encode(keyId.padEnd(32, "0").slice(0, 32));
        return crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["encrypt", "decrypt"]);
    }
}
