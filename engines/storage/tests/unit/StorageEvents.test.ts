import { describe, it, expect } from "vitest";
import { StorageTransactionCommittedEvent, StorageRecoveryEvent, StorageExecutionFailedEvent } from "../../src/Domain/Events/index.ts";

describe("Storage Events", () => {
    it("should create transaction committed event", () => {
        const event = new StorageTransactionCommittedEvent("tx-1", "s1", 2, "c1");
        expect(event.eventType).toBe("EVT_STORE_TransactionCommitted");
        expect(event.timestamp).toBeGreaterThan(0);
    });

    it("should create recovery event", () => {
        const event = new StorageRecoveryEvent(5, 10, "c1");
        expect(event.eventType).toBe("EVT_STORE_RecoveryCompleted");
    });

    it("should create execution failed event", () => {
        const event = new StorageExecutionFailedEvent("op", "error", "c1");
        expect(event.eventType).toBe("EVT_STORE_ExecutionFailed");
    });
});
