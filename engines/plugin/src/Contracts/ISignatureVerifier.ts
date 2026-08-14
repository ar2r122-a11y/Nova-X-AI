export interface ISignatureVerifier {
    verifyManifestSignature(manifestData: string, signature: Uint8Array): Promise<boolean>;
}
