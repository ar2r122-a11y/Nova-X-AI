import { describe, it, expect } from "vitest";
import { VoiceEngineSecurity } from "../../../src/Infrastructure/Integration/VoiceEngineSecurity";

describe("SecurityBoundary", () => {
    it("VoiceEngineSecurity sanitizes text by stripping angle brackets", () => {
        const security = new VoiceEngineSecurity();
        const result = security.sanitizeText("<script>alert('xss')</script>");

        expect(result).not.toContain("<");
        expect(result).not.toContain(">");
    });

    it("VoiceEngineSecurity trims whitespace", () => {
        const security = new VoiceEngineSecurity();
        const result = security.sanitizeText("  hello world  ");

        expect(result).toBe("hello world");
    });

    it("VoiceEngineSecurity.validateVoiceAccess returns true for valid claims", () => {
        const security = new VoiceEngineSecurity();
        const result = security.validateVoiceAccess("voice-1", { roles: ["user"], permissions: ["read"] });

        expect(result).toBe(true);
    });

    it("VoiceEngineSecurity is instantiable from infrastructure layer", () => {
        const security = new VoiceEngineSecurity();
        expect(security).toBeDefined();
        expect(typeof security.sanitizeText).toBe("function");
        expect(typeof security.validateVoiceAccess).toBe("function");
    });

    it("domain layer does not contain security-sensitive logic bypassing boundary", () => {
        const fs = require("fs");
        const path = require("path");
        const srcDir = path.resolve(__dirname, "../../../src/Domain");

        function search(dir: string): boolean {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === "node_modules") continue;
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    if (search(full)) return true;
                } else if (entry.name.endsWith(".ts")) {
                    const content = fs.readFileSync(full, "utf-8");
                    if (content.includes("localStorage") || content.includes("sessionStorage") || content.includes("document.cookie")) {
                        return true;
                    }
                }
            }
            return false;
        }

        expect(search(srcDir)).toBe(false);
    });
});
