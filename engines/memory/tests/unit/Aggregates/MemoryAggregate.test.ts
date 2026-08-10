import { describe, it, expect } from "vitest";
import { MemoryAggregate } from "../../../src/Domain/Aggregates/MemoryAggregate";
import { MemoryTypeRef } from "../../../src/Domain/ValueObjects/MemoryType";
import { MemorySalience } from "../../../src/Domain/ValueObjects/MemorySalience";
import { ContentHash } from "../../../src/Domain/ValueObjects/ContentHash";

describe("MemoryAggregate", () => {
    it("should store a memory", () => {
        const aggregate = new MemoryAggregate();
        const entry = aggregate.storeMemory({
            content: "test content",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.8),
            contentHash: ContentHash.compute("test content"),
            ownerId: "owner-1",
            tags: ["test"],
            decayRate: 0.01
        });
        expect(aggregate.getMemoryCount()).toBe(1);
        expect(entry.getContent()).toBe("test content");
    });

    it("should recall a memory", () => {
        const aggregate = new MemoryAggregate();
        const entry = aggregate.storeMemory({
            content: "test content",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.8),
            contentHash: ContentHash.compute("test content"),
            ownerId: "owner-1",
            tags: [],
            decayRate: 0.01
        });
        const recalled = aggregate.recallMemory(entry.getId());
        expect(recalled).toBeDefined();
        expect(recalled!.getAccessCount()).toBe(1);
    });

    it("should decay active memories", () => {
        const aggregate = new MemoryAggregate();
        aggregate.storeMemory({
            content: "test",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.8),
            contentHash: ContentHash.compute("test"),
            ownerId: "owner-1",
            tags: [],
            decayRate: 0.01
        });
        aggregate.decayAllMemories(0.1);
        const memories = aggregate.getAllMemories();
        expect(memories[0].getSalience().getValue()).toBeCloseTo(0.7, 5);
    });

    it("should forget a memory", () => {
        const aggregate = new MemoryAggregate();
        const entry = aggregate.storeMemory({
            content: "test",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.8),
            contentHash: ContentHash.compute("test"),
            ownerId: "owner-1",
            tags: [],
            decayRate: 0.01
        });
        const result = aggregate.forgetMemory(entry.getId());
        expect(result).toBe(true);
        expect(entry.getState().isForgotten()).toBe(true);
    });

    it("should get memories by owner", () => {
        const aggregate = new MemoryAggregate();
        aggregate.storeMemory({
            content: "owner1",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.8),
            contentHash: ContentHash.compute("owner1"),
            ownerId: "owner-1",
            tags: [],
            decayRate: 0.01
        });
        aggregate.storeMemory({
            content: "owner2",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.8),
            contentHash: ContentHash.compute("owner2"),
            ownerId: "owner-2",
            tags: [],
            decayRate: 0.01
        });
        const owner1Memories = aggregate.getMemoriesByOwner("owner-1");
        expect(owner1Memories.length).toBe(1);
    });

    it("should produce domain events", () => {
        const aggregate = new MemoryAggregate();
        aggregate.storeMemory({
            content: "test",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.8),
            contentHash: ContentHash.compute("test"),
            ownerId: "owner-1",
            tags: [],
            decayRate: 0.01
        });
        const events = aggregate.getUncommittedEvents();
        expect(events.length).toBe(1);
        expect(events[0].eventType).toBe("EVT_MEM_MemoryStored");
    });
});
