import { describe, it, expect } from "vitest";
import { MemoryProjectionUpdater } from "../../../src/Application/Projections/MemoryProjectionUpdater";
import { MemoryStoredEvent, MemoryForgottenEvent } from "../../../src/Domain/Events";
import { MemoryId } from "../../../src/Domain/ValueObjects/MemoryId";
import { MemoryTypeRef } from "../../../src/Domain/ValueObjects/MemoryType";

describe("MemoryProjectionUpdater", () => {
    it("should update read model on MemoryStoredEvent", () => {
        const updater = new MemoryProjectionUpdater();
        const event = new MemoryStoredEvent(MemoryId.create("mem-1"), MemoryTypeRef.episodic(), "owner-1", Date.now(), "corr-1");
        updater.handleStored(event);
        const readModel = updater.getReadModel();
        const memories = readModel.getByOwner("owner-1");
        expect(memories.length).toBe(1);
        expect(memories[0].memoryId).toBe("mem-1");
    });

    it("should remove from read model on MemoryForgottenEvent", () => {
        const updater = new MemoryProjectionUpdater();
        const storedEvent = new MemoryStoredEvent(MemoryId.create("mem-1"), MemoryTypeRef.episodic(), "owner-1", Date.now(), "corr-1");
        updater.handleStored(storedEvent);
        const forgottenEvent = new MemoryForgottenEvent(MemoryId.create("mem-1"), "owner-1", Date.now(), "corr-2");
        updater.handleForgotten(forgottenEvent);
        const memories = updater.getReadModel().getByOwner("owner-1");
        expect(memories.length).toBe(0);
    });
});
