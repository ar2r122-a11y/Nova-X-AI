import { describe, it, expect } from "vitest";
import { MemoryReadModelImpl } from "../../../src/Application/Projections/MemoryReadModelImpl";
import { MemoryRecordDto } from "../../../src/Application/DTO/MemoryRecordDto";

describe("MemoryReadModel", () => {
    it("should upsert and retrieve memories", () => {
        const readModel = new MemoryReadModelImpl();
        const dto = new MemoryRecordDto("mem-1", "episodic", "content", 0.8, "owner-1", Date.now(), Date.now(), Date.now(), 0, "active", [], "hash", undefined, undefined, undefined);
        readModel.upsertMemory(dto);
        const memories = readModel.getByOwner("owner-1");
        expect(memories.length).toBe(1);
        expect(memories[0].memoryId).toBe("mem-1");
    });

    it("should remove memories", () => {
        const readModel = new MemoryReadModelImpl();
        const dto = new MemoryRecordDto("mem-1", "episodic", "content", 0.8, "owner-1", Date.now(), Date.now(), Date.now(), 0, "active", [], "hash", undefined, undefined, undefined);
        readModel.upsertMemory(dto);
        readModel.removeMemory("mem-1");
        const memories = readModel.getByOwner("owner-1");
        expect(memories.length).toBe(0);
    });

    it("should filter by type", () => {
        const readModel = new MemoryReadModelImpl();
        readModel.upsertMemory(new MemoryRecordDto("mem-1", "episodic", "c1", 0.8, "owner-1", Date.now(), Date.now(), Date.now(), 0, "active", [], "hash", undefined, undefined, undefined));
        readModel.upsertMemory(new MemoryRecordDto("mem-2", "semantic", "c2", 0.8, "owner-1", Date.now(), Date.now(), Date.now(), 0, "active", [], "hash", undefined, undefined, undefined));
        const episodic = readModel.getByType("owner-1", "episodic");
        expect(episodic.length).toBe(1);
        expect(episodic[0].memoryId).toBe("mem-1");
    });
});
