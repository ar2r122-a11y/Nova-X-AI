import { describe, it, expect } from "vitest";
import { TransactionId } from "../../src/Domain/ValueObjects/index.ts";

describe("TransactionId", () => {
    it("should create a new transaction id", () => {
        const id = TransactionId.create();
        expect(id.getValue()).toContain("tx-");
    });

    it("should parse from string", () => {
        const id = TransactionId.fromString("tx-123");
        expect(id.getValue()).toBe("tx-123");
    });

    it("should compare equal", () => {
        const a = TransactionId.fromString("tx-1");
        const b = TransactionId.fromString("tx-1");
        expect(a.equals(b)).toBe(true);
    });
});
