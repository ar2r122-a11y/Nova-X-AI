import { IDomainEvent } from "@nova-x-ai/core";
import { MemoryEntry, type MemoryEntryProps } from "../Entities/MemoryEntry";
import { MemoryStoredEvent, MemoryRetrievedEvent, MemoryDecayedEvent, MemoryForgottenEvent, MemoryConsolidatedEvent, MemoryClusterFormedEvent } from "../Events";

export class MemoryAggregate {
    private readonly memories: Map<string, MemoryEntry>;
    private readonly uncommittedEvents: IDomainEvent[];

    constructor() {
        this.memories = new Map();
        this.uncommittedEvents = [];
    }

    static reconstitute(memories: MemoryEntry[]): MemoryAggregate {
        const aggregate = new MemoryAggregate();
        for (const memory of memories) {
            aggregate.memories.set(memory.getId().getValue(), memory);
        }
        return aggregate;
    }

    storeMemory(props: Omit<MemoryEntryProps, "id" | "createdAt" | "updatedAt" | "lastAccessedAt" | "accessCount" | "state">): MemoryEntry {
        const entry = MemoryEntry.create(props);
        this.memories.set(entry.getId().getValue(), entry);
        this.uncommittedEvents.push(new MemoryStoredEvent(entry.getId(), entry.getType(), entry.getOwnerId(), Date.now(), ""));
        return entry;
    }

    recallMemory(memoryId: import("../ValueObjects/MemoryId").MemoryId): MemoryEntry | undefined {
        const memory = this.memories.get(memoryId.getValue());
        if (memory) {
            memory.access();
            this.uncommittedEvents.push(new MemoryRetrievedEvent(memoryId, memory.getOwnerId(), Date.now(), ""));
        }
        return memory;
    }

    decayAllMemories(rate: number): void {
        for (const memory of this.memories.values()) {
            if (memory.getState().isActive()) {
                memory.decaySalience(rate);
                this.uncommittedEvents.push(new MemoryDecayedEvent(memory.getId(), memory.getSalience().getValue(), Date.now(), ""));
            }
        }
    }

    forgetMemory(memoryId: import("../ValueObjects/MemoryId").MemoryId): boolean {
        const memory = this.memories.get(memoryId.getValue());
        if (!memory) {
            return false;
        }
        memory.forget();
        this.uncommittedEvents.push(new MemoryForgottenEvent(memoryId, memory.getOwnerId(), Date.now(), ""));
        return true;
    }

    consolidateMemory(memoryId: import("../ValueObjects/MemoryId").MemoryId, clusterId: import("../ValueObjects/MemoryClusterId").MemoryClusterId): boolean {
        const memory = this.memories.get(memoryId.getValue());
        if (!memory) {
            return false;
        }
        memory.consolidate(clusterId);
        this.uncommittedEvents.push(new MemoryConsolidatedEvent(memoryId, clusterId, memory.getOwnerId(), Date.now(), ""));
        return true;
    }

    formCluster(clusterId: import("../ValueObjects/MemoryClusterId").MemoryClusterId, memberIds: import("../ValueObjects/MemoryId").MemoryId[]): void {
        for (const memberId of memberIds) {
            this.consolidateMemory(memberId, clusterId);
        }
        this.uncommittedEvents.push(new MemoryClusterFormedEvent(clusterId, memberIds.map((id) => id.getValue()), Date.now(), ""));
    }

    getMemory(memoryId: import("../ValueObjects/MemoryId").MemoryId): MemoryEntry | undefined {
        return this.memories.get(memoryId.getValue());
    }

    getMemoriesByOwner(ownerId: string): MemoryEntry[] {
        return Array.from(this.memories.values()).filter((m) => m.getOwnerId() === ownerId);
    }

    getActiveMemories(): MemoryEntry[] {
        return Array.from(this.memories.values()).filter((m) => m.getState().isActive());
    }

    getAllMemories(): MemoryEntry[] {
        return Array.from(this.memories.values());
    }

    getMemoryCount(): number {
        return this.memories.size;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): MemoryEntry[] {
        return Array.from(this.memories.values());
    }
}
