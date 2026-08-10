import { describe, it, expect } from "vitest";
import { MemoryRetentionPolicy } from "../../../src/Domain/Policies/MemoryRetentionPolicy";
import { MemoryEntry } from "../../../src/Domain/Entities/MemoryEntry";
import { MemoryTypeRef } from "../../../src/Domain/ValueObjects/MemoryType";
import { MemorySalience } from "../../../src/Domain/ValueObjects/MemorySalience";
import { ContentHash } from "../../../src/Domain/ValueObjects/ContentHash";

describe("MemoryRetentionPolicy", () => {
    it("should retain recent high-salience memories", () => {
        const policy = new MemoryRetentionPolicy({ minSalience: 0.2, maxAgeMs: 100000 });
        const memory = MemoryEntry.create({
            content: "test",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.8),
            contentHash: ContentHash.compute("test"),
            ownerId: "owner-1",
            tags: [],
            decayRate: 0.01
        });
        expect(policy.shouldRetain(memory)).toBe(true);
    });

    it("should expire low-salience memories with high access count", () => {
        const lowMemory = MemoryEntry.create({
            content: "test",
            type: MemoryTypeRef.episodic(),
            salience: MemorySalience.create(0.1),
            contentHash: ContentHash.compute("test"),
            ownerId: "owner-1",
            tags: [],
            decayRate: 0.01
        });
        lowMemory.access();
        lowMemory.access();
        const policy = new MemoryRetentionPolicy({ minSalience: 0.5, maxAgeMs: 10000000 });
        expect(policy.shouldRetain(lowMemory)).toBe(false);
    });
});
