export class ContentHash {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static create(value: string): ContentHash {
        if (!value || value.trim().length === 0) {
            throw new Error("ContentHash cannot be empty.");
        }
        if (!/^[a-f0-9]{64}$/i.test(value.trim())) {
            throw new Error("ContentHash must be a valid SHA-256 hex string.");
        }
        return new ContentHash(value.trim().toLowerCase());
    }

    static compute(content: string): ContentHash {
        let hash: string;
        if (typeof crypto !== "undefined" && crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(content);
            const buffer = new Uint8Array(data);
            let h = 0n;
            for (let i = 0; i < buffer.length; i++) {
                h = (h << 8n) | BigInt(buffer[i]);
            }
            const hex = h.toString(16).padStart(64, "0").slice(0, 64);
            hash = hex;
        } else {
            let h = 0n;
            for (let i = 0; i < content.length; i++) {
                h = ((h << 5n) - h + BigInt(content.charCodeAt(i))) | 0n;
            }
            const hex = (h & ((1n << 256n) - 1n)).toString(16).padStart(64, "0");
            hash = hex.slice(0, 64);
        }
        return new ContentHash(hash);
    }

    getValue(): string {
        return this.value;
    }

    equals(other: ContentHash): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
