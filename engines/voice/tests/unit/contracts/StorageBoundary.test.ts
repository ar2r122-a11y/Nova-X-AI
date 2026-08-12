import { describe, it, expect } from "vitest";

describe("StorageBoundary", () => {
    it("domain layer imports storage interfaces only through repository contracts", () => {
        const fs = require("fs");
        const path = require("path");
        const srcDir = path.resolve(__dirname, "../../../src/Domain");

        function search(dir: string): string[] {
            const files: string[] = [];
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === "node_modules") continue;
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    files.push(...search(full));
                } else if (entry.name.endsWith(".ts")) {
                    const content = fs.readFileSync(full, "utf-8");
                    if (content.includes("@nova-x-ai/storage")) {
                        files.push(path.relative(srcDir, full));
                    }
                }
            }
            return files;
        }

        const storageFiles = search(srcDir);
        for (const file of storageFiles) {
            expect(file).toMatch(/Repositories[\\/]/);
        }
    });

    it("storage imports are confined to infrastructure and repository contracts", () => {
        const fs = require("fs");
        const path = require("path");
        const srcDir = path.resolve(__dirname, "../../../src");

        function search(dir: string): string[] {
            const files: string[] = [];
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === "node_modules") continue;
                const full = path.join(dir, entry.name);
                const rel = path.relative(srcDir, full);
                if (entry.isDirectory()) {
                    files.push(...search(full));
                } else if (entry.name.endsWith(".ts")) {
                    const content = fs.readFileSync(full, "utf-8");
                    if (content.includes("@nova-x-ai/storage")) {
                        files.push(rel);
                    }
                }
            }
            return files;
        }

        const storageImports = search(srcDir);
        for (const file of storageImports) {
            const normalized = file.replace(/\\/g, "/");
            const allowed = [
                "Infrastructure/Persistence/",
                "Infrastructure/Projections/",
                "Infrastructure/Snapshots/",
                "Infrastructure/Streaming/",
                "Infrastructure/Integration/",
                "Domain/Repositories/",
                "Application/Projections/",
                "Presentation/"
            ];
            const isAllowed = allowed.some(prefix => normalized.startsWith(prefix));
            expect(isAllowed).toBe(true);
        }
    });

    it("no direct IndexedDB or browser storage access from domain/application", () => {
        const fs = require("fs");
        const path = require("path");
        const srcDir = path.resolve(__dirname, "../../../src/Domain");
        const appDir = path.resolve(__dirname, "../../../src/Application");

        function search(dir: string): boolean {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.name === "node_modules") continue;
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    if (search(full)) return true;
                } else if (entry.name.endsWith(".ts")) {
                    const content = fs.readFileSync(full, "utf-8");
                    if (content.includes("IndexedDB") || content.includes("indexedDB") || content.includes("localStorage") || content.includes("idb")) {
                        return true;
                    }
                }
            }
            return false;
        }

        expect(search(srcDir)).toBe(false);
        expect(search(appDir)).toBe(false);
    });
});
