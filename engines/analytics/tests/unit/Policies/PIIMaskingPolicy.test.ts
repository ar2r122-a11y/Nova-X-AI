import { describe, it, expect } from "vitest";
import { PIIMaskingPolicy } from "../../../src/Domain/Policies/PIIMaskingPolicy";

describe("PIIMaskingPolicy", () => {
    it("should strip known PII fields", () => {
        const result = PIIMaskingPolicy.stripPII({
            content: "secret message",
            apiKey: "sk-123",
            normalField: "safe"
        });

        expect(result.fieldsStripped).toContain("content");
        expect(result.fieldsStripped).toContain("apiKey");
        expect(result.sanitized.content).toBe("[REDACTED]");
        expect(result.sanitized.apiKey).toBe("[REDACTED]");
        expect(result.sanitized.normalField).toBe("safe");
    });

    it("should hash values that look like PII", () => {
        const result = PIIMaskingPolicy.stripPII({
            note: "contact me at user@example.com",
            server: "192.168.1.1"
        });

        expect(result.fieldsStripped).toContain("note");
        expect(result.sanitized.note).not.toBe("contact me at user@example.com");
    });

    it("should anonymize IP addresses", () => {
        expect(PIIMaskingPolicy.anonymizeIP("192.168.1.100")).toBe("192.168.*.*");
    });
});
