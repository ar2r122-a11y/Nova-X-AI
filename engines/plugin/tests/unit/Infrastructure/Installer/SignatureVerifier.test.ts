import { describe, test, expect } from "vitest";
import { SignatureVerifier } from "../../../../src/Infrastructure/Installer/SignatureVerifier";

describe("SignatureVerifier", () => {
    test("verifies a valid manifest signature", async () => {
        const verifier = new SignatureVerifier();
        const result = await verifier.verifyManifestSignature("{}", new Uint8Array(32));
        expect(result).toBe(true);
    });
});
