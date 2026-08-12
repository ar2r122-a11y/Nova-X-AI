import { describe, it, expect } from "vitest";

describe("UnitOfWork (Voice Engine)", () => {
    it("does not define a local UnitOfWork implementation", () => {
        const fs = require("fs");
        const path = require("path");
        const srcDir = path.resolve(__dirname, "../../../src");

        let hasUnitOfWork = false;
        function search(dir: string) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === "node_modules") continue;
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    search(full);
                } else if (entry.name.endsWith(".ts")) {
                    const content = fs.readFileSync(full, "utf-8");
                    if (content.includes("UnitOfWork") && content.includes("voice")) {
                        hasUnitOfWork = true;
                    }
                }
            }
        }
        search(srcDir);
        expect(hasUnitOfWork).toBe(false);
    });

    it("does not directly invoke getUnitOfWork on the storage engine", () => {
        const fs = require("fs");
        const path = require("path");
        const srcDir = path.resolve(__dirname, "../../../src");

        function search(dir: string): boolean {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === "node_modules") continue;
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    if (search(full)) return true;
                } else if (entry.name.endsWith(".ts")) {
                    const content = fs.readFileSync(full, "utf-8");
                    if (content.includes("getUnitOfWork")) {
                        return true;
                    }
                }
            }
            return false;
        }
        expect(search(srcDir)).toBe(false);
    });
});
