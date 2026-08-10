import { describe, it, expect } from "vitest";
import { WALJournal } from "../../src/Infrastructure/Persistence/WALJournal.ts";

function createMockRequest(result: any = []) {
    const handlers: any = {};
    return {
        get onsuccess() { return handlers.onsuccess; },
        set onsuccess(fn: any) { handlers.onsuccess = fn; if (fn) fn(); },
        get onerror() { return handlers.onerror; },
        set onerror(fn: any) { handlers.onerror = fn; if (fn) fn(); },
        result
    };
}

describe("WALJournal", () => {
    it("should append and read entries", async () => {
        const adapter = {
            transaction: () => ({
                objectStore: () => ({
                    add: () => createMockRequest(),
                    getAll: () => createMockRequest([]),
                    openCursor: () => null,
                    clear: () => createMockRequest(),
                    count: () => createMockRequest(0)
                })
            })
        } as any;

        const journal = new WALJournal(adapter);
        await journal.append({ operation: "append", data: { a: 1 }, timestamp: Date.now() });
        const entries = await journal.readEntries(0);
        expect(Array.isArray(entries)).toBe(true);
    });

    it("should clear entries", async () => {
        const adapter = {
            transaction: () => ({
                objectStore: () => ({
                    add: () => createMockRequest(),
                    getAll: () => createMockRequest([]),
                    openCursor: () => null,
                    clear: () => createMockRequest(),
                    count: () => createMockRequest(0)
                })
            })
        } as any;

        const journal = new WALJournal(adapter);
        await journal.append({ operation: "append", data: { a: 1 }, timestamp: Date.now() });
        await journal.clear();
        const entries = await journal.readEntries(0);
        expect(entries).toHaveLength(0);
    });
});
