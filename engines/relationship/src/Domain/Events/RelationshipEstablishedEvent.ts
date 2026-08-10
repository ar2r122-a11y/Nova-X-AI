import { IDomainEvent } from "@nova-x-ai/core";

export class RelationshipEstablishedEvent implements IDomainEvent {
    readonly eventType = "EVT_REL_RelationshipEstablished";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly relationshipId: string,
        public readonly sourceEntityId: string,
        public readonly targetEntityId: string,
        public readonly bondType: string,
        timestamp: number,
        correlationId: string
    ) {
        this.timestamp = timestamp;
        this.correlationId = correlationId;
    }
}
