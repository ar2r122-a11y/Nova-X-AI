import { describe, it, expect } from "vitest";
import { PayloadSanitizer } from "../../src/Infrastructure/Sanitization/PayloadSanitizer";

describe("PayloadSanitizer", () => {
    const sanitizer = new PayloadSanitizer();

    it("should sanitize script tags", async () => {
        const result = await sanitizer.sanitize("<script>alert('xss')</script>", "input");
        expect(result.threatsRemoved).toBe(2);
        expect(result.sanitized).not.toContain("<script>");
    });

    it("should sanitize javascript protocol", async () => {
        const result = await sanitizer.sanitize("javascript:alert('xss')", "input");
        expect(result.threatsRemoved).toBe(1);
        expect(result.sanitized).not.toContain("javascript:");
    });

    it("should sanitize event handlers", async () => {
        const result = await sanitizer.sanitize("<div onclick='alert(1)'>test</div>", "input");
        expect(result.threatsRemoved).toBe(1);
        expect(result.sanitized).not.toContain("onclick");
    });

    it("should sanitize template expressions", async () => {
        const result = await sanitizer.sanitize("{{injection}}", "input");
        expect(result.threatsRemoved).toBe(1);
        expect(result.sanitized).not.toContain("{{");
    });

    it("should sanitize jsx expressions", async () => {
        const result = await sanitizer.sanitize("${injection}", "input");
        expect(result.threatsRemoved).toBe(1);
        expect(result.sanitized).not.toContain("${");
    });

    it("should pass through non-strings", async () => {
        const result = await sanitizer.sanitize({ key: "value" }, "input");
        expect(result.threatsRemoved).toBe(0);
        expect(result.sanitized).toEqual({ key: "value" });
    });
});
