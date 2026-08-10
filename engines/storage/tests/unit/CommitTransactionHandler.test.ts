import { describe, it, expect } from "vitest";
import { CommitTransactionHandler } from "../../src/Application/Handlers/CommitTransactionHandler.ts";

describe("CommitTransactionHandler", () => {
    it("should be instantiable", () => {
        const handler = new CommitTransactionHandler(null as any);
        expect(handler).toBeDefined();
    });
});
