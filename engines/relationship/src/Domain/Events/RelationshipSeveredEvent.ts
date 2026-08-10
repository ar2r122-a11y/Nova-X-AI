import { IDomainEvent } from "@nova-x-ai/core";

export class RelationshipSeveredEvent implements IDomainEvent {
    readonly eventType = "EVT_REL_RelationshipSevered";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly relationshipId: string,
        public readonly sourceEntityId: string,
        public readonly targetEntityId: string,
        public readonly finalMetrics: { trust: number; affinity: number; respect: number; loyalty: number },
        public readonly reason: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
