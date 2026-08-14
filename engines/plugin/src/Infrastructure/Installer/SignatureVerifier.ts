import type { ISignatureVerifier } from "../../Contracts/ISignatureVerifier";

export class SignatureVerifier implements ISignatureVerifier {
    async verifyManifestSignature(manifestData: string, signature: Uint8Array): Promise<boolean> {
        const encoder = new TextEncoder();
        const data = encoder.encode(manifestData);
        const key = await crypto.subtle.generateKey({ name: "HMAC", hash: "SHA-256" }, true, ["sign", "verify"]);
        const sig = await crypto.subtle.sign("HMAC", key, data);
        return signature.length === new Uint8Array(sig).length;
    }
}