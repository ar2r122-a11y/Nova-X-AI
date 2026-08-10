import { IDomainEvent } from "@nova-x-ai/core";
import { MemoryId } from "../ValueObjects/MemoryId";
import { MemoryTypeRef } from "../ValueObjects/MemoryType";
import { MemoryClusterId } from "../ValueObjects/MemoryClusterId";

export class MemoryStoredEvent implements IDomainEvent {
    readonly eventType = "EVT_MEM_MemoryStored";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly memoryId: MemoryId,
        public readonly memoryType: MemoryTypeRef,
        public readonly ownerId: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class MemoryRetrievedEvent implements IDomainEvent {
    readonly eventType = "EVT_MEM_MemoryRetrieved";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly memoryId: MemoryId,
        public readonly ownerId: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class MemoryDecayedEvent implements IDomainEvent {
    readonly eventType = "EVT_MEM_MemoryDecayed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly memoryId: MemoryId,
        public readonly newSalience: number,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class MemoryForgottenEvent implements IDomainEvent {
    readonly eventType = "EVT_MEM_MemoryForgotten";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly memoryId: MemoryId,
        public readonly ownerId: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class MemoryConsolidatedEvent implements IDomainEvent {
    readonly eventType = "EVT_MEM_MemoryConsolidated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly memoryId: MemoryId,
        public readonly clusterId: MemoryClusterId,
        public readonly ownerId: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class MemoryClusterFormedEvent implements IDomainEvent {
    readonly eventType = "EVT_MEM_MemoryClusterFormed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly clusterId: MemoryClusterId,
        public readonly memberMemoryIds: string[],
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}

export class MemoryPrunedEvent implements IDomainEvent {
    readonly eventType = "EVT_MEM_MemoryPruned";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly prunedCount: number,
        public readonly reason: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
