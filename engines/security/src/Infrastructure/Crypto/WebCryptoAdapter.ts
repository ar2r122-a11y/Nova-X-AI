import type { ICryptoAdapter } from "../../Contracts";

interface KeyEntry {
    key: CryptoKey;
    publicKey?: CryptoKey;
}

export class WebCryptoAdapter implements ICryptoAdapter {
    private keyCache = new Map<string, KeyEntry>();

    async generateKey(algorithm: string): Promise<string> {
        const keyId = `key-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        if (algorithm === "AES-GCM") {
            const cryptoKey = await crypto.subtle.generateKey(
                { name: "AES-GCM", length: 256 },
                true,
                ["encrypt", "decrypt"]
            );
            this.keyCache.set(keyId, { key: cryptoKey });
        } else if (algorithm === "Ed25519") {
            const keyPair = await crypto.subtle.generateKey(
                { name: "Ed25519" },
                true,
                ["sign", "verify"]
            );
            this.keyCache.set(keyId, { key: keyPair.privateKey, publicKey: keyPair.publicKey });
        } else {
            throw new Error(`Unsupported algorithm: ${algorithm}`);
        }

        return keyId;
    }

    async encrypt(data: ArrayBuffer, keyId: string): Promise<{ data: ArrayBuffer; keyId: string }> {
        const entry = this.keyCache.get(keyId);
        if (!entry) {
            throw new Error(`Key not found: ${keyId}`);
        }

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            entry.key,
            data
        );

        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        return { data: combined.buffer, keyId };
    }

    async decrypt(data: ArrayBuffer, keyId: string): Promise<ArrayBuffer> {
        const entry = this.keyCache.get(keyId);
        if (!entry) {
            throw new Error(`Key not found: ${keyId}`);
        }

        const combined = new Uint8Array(data);
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        return crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            entry.key,
            ciphertext
        );
    }

    async sign(data: ArrayBuffer, keyId: string): Promise<ArrayBuffer> {
        const entry = this.keyCache.get(keyId);
        if (!entry) {
            throw new Error(`Key not found: ${keyId}`);
        }

        return crypto.subtle.sign({ name: "Ed25519" }, entry.key, data);
    }

    async verify(data: ArrayBuffer, signature: ArrayBuffer, keyId: string): Promise<boolean> {
        const entry = this.keyCache.get(keyId);
        if (!entry || !entry.publicKey) {
            throw new Error(`Key not found: ${keyId}`);
        }

        return crypto.subtle.verify({ name: "Ed25519" }, entry.publicKey, signature, data);
    }

    async rotateKey(oldKeyId: string, newKeyId: string): Promise<void> {
        const oldEntry = this.keyCache.get(oldKeyId);
        if (!oldEntry) {
            throw new Error(`Old key not found: ${oldKeyId}`);
        }

        const newEntry = this.keyCache.get(newKeyId);
        if (!newEntry) {
            throw new Error(`New key not found: ${newKeyId}`);
        }

        this.keyCache.delete(oldKeyId);
        this.keyCache.set(newKeyId, newEntry);
    }
}
